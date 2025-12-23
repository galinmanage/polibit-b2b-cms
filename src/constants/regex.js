const regex = {
  BOLD_TEXT: /\*([\u0590-\u05fe\w+\s]+)\*/gm,
  BOLD_HTML: /<b>([\u0590-\u05fe\w+\s]+)<\/b>/gm,
  TEMPLATE_BOLD_HTML: `<b>$1</b>`,
  TEMPLATE_BOLD_TEXT: '*$1*',
};

export default regex;
