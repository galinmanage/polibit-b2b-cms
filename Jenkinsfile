pipeline {
    agent any

    environment {
        AWS_REGION          = 'eu-west-1'
        BUILD_AMI_ID        = 'ami-0a5dfd0597dc8600e'
        BUILD_INSTANCE_TYPE = 'c6a.large'
        SUBNET_ID           = 'subnet-b2e435ea'
        SECURITY_GROUP_ID   = 'sg-072fda38ceb09ebd9'
        BUILD_WORKDIR       = '/root/workspace'

        SSH_CREDENTIALS_ID  = 'Qualla'
        REMOTE_USER         = 'root'

        STAGE_SERVER        = '172.31.24.9'
        PREPROD_SERVER      = '172.31.38.138'
        PROD_SERVER         = '172.31.38.138'

        STAGE_PATH          = '/var/www/html/quala/b2b-cms'
        PREPROD_PATH        = '/var/www/html/preprod/b2b-cms'
        PROD_PATH           = '/var/www/html/quala/b2b-cms'

        NODE_VERSION        = '23.11.0'
    }

    stages {
        stage('Provision BuildServer') {
            steps {
                script {
                    // Launch instance and immediately record its ID for later cleanup
                    def instanceId = sh(script: """
                        aws ec2 run-instances --region $AWS_REGION --image-id $BUILD_AMI_ID \
                        --instance-type $BUILD_INSTANCE_TYPE --count 1 --subnet-id $SUBNET_ID \
                        --security-group-ids $SECURITY_GROUP_ID \
                        --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=BuildServer}]' \
                        --query 'Instances[0].InstanceId' --output text
                    """, returnStdout: true).trim()

                    // Set env var early so cleanup can happen even if wait is aborted
                    env.BUILD_SERVER_ID = instanceId

                    // Wait until instance is running and fetch its private IP
                    sh "aws ec2 wait instance-running --region ${AWS_REGION} --instance-ids ${instanceId}"
                    def buildIp = sh(script: "aws ec2 describe-instances --region ${AWS_REGION} --instance-ids ${instanceId} --query 'Reservations[0].Instances[0].PrivateIpAddress' --output text", returnStdout: true).trim()
                    env.BUILD_SERVER = buildIp
                }
            }
        }

        stage('Sync to BuildServer') {
            steps {
                sh 'git submodule sync --recursive'
                sh 'git submodule update --init --recursive'
                withCredentials([sshUserPrivateKey(credentialsId: SSH_CREDENTIALS_ID, keyFileVariable: 'SSH_KEY')]) {
                    sh '''
                        chmod 600 "$SSH_KEY"
                        rsync -avz --exclude 'build-*' -e "ssh -i '$SSH_KEY' -o StrictHostKeyChecking=no" \
                          ./ ${REMOTE_USER}@${BUILD_SERVER}:${BUILD_WORKDIR}/
                    '''
                }
            }
        }

        stage('Build on BuildServer') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: SSH_CREDENTIALS_ID, keyFileVariable: 'SSH_KEY')]) {
                    script {
                        def branchFullName = env.BRANCH_NAME
                        def branch = branchFullName.replaceFirst(/^jenkins-/, '')
                        if (!(branch in ['stage', 'preprod', 'production'])) error("Unsupported branch ${branch}")
                        sh """
                            ssh -i '$SSH_KEY' -o StrictHostKeyChecking=no ${REMOTE_USER}@${BUILD_SERVER} '
                                nvm install ${NODE_VERSION} &&
                                nvm alias default ${NODE_VERSION} &&
                                nvm use ${NODE_VERSION} &&
                                cd ${BUILD_WORKDIR} &&
                                rm -rf node_modules package-lock.json &&
                                npm install &&
                                npm run build:${branch}
                            '
                        """
                    }
                }
            }
        }

        stage('Fetch Artifacts') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: SSH_CREDENTIALS_ID, keyFileVariable: 'SSH_KEY')]) {
                    script {
                        def branchFullName = env.BRANCH_NAME
                        def branch = branchFullName.replaceFirst(/^jenkins-/, '')
                        def localDir = "build-${branch}"
                        sh '''
                            chmod 600 "$SSH_KEY"
                            rsync -avz -e "ssh -i '$SSH_KEY' -o StrictHostKeyChecking=no" \
                              ${REMOTE_USER}@${BUILD_SERVER}:${BUILD_WORKDIR}/${localDir}/ ./${localDir}/
                        '''
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    def branchFullName = env.BRANCH_NAME
                    def branch = branchFullName.replaceFirst(/^jenkins-/, '')
                    def targetServer = branch == 'stage' ? STAGE_SERVER : branch == 'preprod' ? PREPROD_SERVER : PROD_SERVER
                    def targetDir    = branch == 'stage' ? STAGE_PATH : branch == 'preprod' ? PREPROD_PATH : PROD_PATH
                    def localDir     = "build-${branch}"
                    withCredentials([sshUserPrivateKey(credentialsId: SSH_CREDENTIALS_ID, keyFileVariable: 'SSH_KEY')]) {
                        sh "ssh -i '$SSH_KEY' -o StrictHostKeyChecking=no ${REMOTE_USER}@${targetServer} 'mkdir -p ${targetDir}'"
                        sh "rsync -avz --delete -e 'ssh -i \"$SSH_KEY\" -o StrictHostKeyChecking=no' ${localDir}/ ${REMOTE_USER}@${targetServer}:${targetDir}/"
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                if (env.BUILD_SERVER_ID) {
                    // Ensure termination even on abort/cancel
                    sh "aws ec2 terminate-instances --region ${AWS_REGION} --instance-ids ${BUILD_SERVER_ID}"
                }
            }
            // CLEAN UP JENKINS WORKSPACE
            deleteDir()
        }
    }
}
