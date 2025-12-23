class Field {
  name;
  results = 1;
  id = 0;
  is_dropdown = false;
  num_of_services = 0;
  is_file = false;
  is_figure = false;
  is_extra_info = false;
  is_question = false;
  figure_or_file_name = '';
  grow_id = '';

  constructor(name, results, num_of_services, is_file, is_figure, is_extra_info, figure_or_file_name, id, is_question) {
    this.name = name;
    if (arguments.length > 1) {
      this.results = results;
      this.num_of_services = num_of_services;
      this.is_file = is_file;
      this.is_figure = is_figure;
      this.is_extra_info = is_extra_info;
      this.figure_or_file_name = figure_or_file_name;
      this.id = id;
      this.is_question = is_question;
    }
  }

  setCalCode(cal_code) {
    this.cal_code = cal_code;
  }

  setGrowId(grow_id) {
    const trimmedValue = String(grow_id || '')?.trim() || '';
    const isNumber = !isNaN(trimmedValue);

    if (isNumber) {
      this.grow_id = parseInt(trimmedValue) || '';
    }
  }

  setId(id) {
    this.id = id;
  }

  setNumOfServices(num_of_services) {
    this.num_of_services = num_of_services;
  }

  setIsQuestions(val) {
    this.is_question = val;
  }

  setFigureOrFileName(name) {
    this.figure_or_file_name = name;
  }

  setIsFile(val) {
    this.is_file = val;
  }

  setIsFigure(val) {
    this.is_figure = val;
  }

  setResults(results) {
    this.results = results;
  }

  setIsExtraInfo(isExtra) {
    this.is_extra_info = isExtra;
  }

  setDropdown(drops) {
    this.is_dropdown = drops;
  }

  addToDropdown(option) {
    Array.isArray(this.is_dropdown) ? (
      this.is_dropdown.push(option)
    ) : (this.is_dropdown = [option]);
  }

  isDropdown() {
    return this.is_dropdown !== false;
  }


  setName(name) {
    this.name = name;
  }

  parseJson() {
    return JSON.stringify(this);
  }
}

export default Field;
