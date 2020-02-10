/* Frank Poth 2020-01-02 */

import { Link } from '/modules/templates/link.js';

export const Page = {
  
  getHTML(callback) {
    
    callback(`<style>${this.style}</style>
<style>${Link.style}</style>
<br>
<span class = "title">This site is under major construction. For Poth On Programming, click the link below!</span>
<br><br>
<div>
  ${Link.getHTML('PothOnProgramming', 'Click here to visit the PothOnProgramming website.', 'https://pothonprogramming.github.io')}
  <br>
  ${Link.getHTML('JavaScript Projects', 'Click here to see some of my JavaScript projects.', '#/pages/javascript-projects/javascript-projects.js')}
</div>`);

  },

  style:`.title {

    color:#000000;

  }
  
  .some-class {

    background-color:#ff0000;

  }`
  
};