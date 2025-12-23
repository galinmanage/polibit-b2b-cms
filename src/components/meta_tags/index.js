import React, { Component } from 'react';
import { connect } from 'react-redux';

class Meta extends Component {

  render() {
    const data = this.props.Tags;
    let metaTagsArr = [];
    if (data) {
      for (let key in data.meta_tags) {
        metaTagsArr.push(
          <meta name={key} content={data.meta_tags[key]} key={key} />,
        );
      }

    } else {
      return <></>;
    }

    // return (
    //     <MetaTags>
    //         { data &&
    //             <>
    //                 { metaTagsArr }
    //                 <title>{ data.meta_tags['title'] }</title>
    //                 {
    //                     data.extra_tags.map((item) => {
    //                         return (
    //                             ReactHtmlParser(item)
    //                         )
    //                     })
    //                 }
    //             </>
    //         }
    //     </MetaTags>
    // )
  }
}

const mapStateToProps = store => {
  return {
    Tags: store.metaTags,
  };
};

export default connect(mapStateToProps, null, null, { pure: false })(Meta);
