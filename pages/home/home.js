/* Frank Poth 2020-01-02 */

import { Link } from '/modules/templates/link.js';

export const Page = {
  
  getHTML(callback) {
    
    callback(`<style>${this.style}</style>
<style>${Link.style}</style>
<span class = "title">Test Title!</span>
<div>
  ${Link.getHTML('PothOnProgramming', 'Click here to visit the PothOnProgramming website.', 'https://pothonprogramming.github.io')}
  ${Link.getHTML('JavaScript Projects', 'Click here to see some of my JavaScript projects.', '#/pages/javascript-projects/javascript-projects.js')}
</div>`);

  },

  style:`.title {

    color:#ff0000;

  }
  
  .some-class {

    background-color:#ff0000;

  }`
  
};