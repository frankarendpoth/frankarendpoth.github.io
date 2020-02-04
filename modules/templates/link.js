/* Frank Poth 2020-01-02 */

export const Link = {

  getHTML(name, description, url, target = '_self') {
  
    return `<div class = "link">
  <a class = "link-a" href = "${url}" target = "${target}">${name}</a>
  <p class = "link-p">${description}</p>
</div>`;
  
  },

  style:`.link { display:block; }

.link-a {
  
  color:#0099ff;
  display:inline;
  
}

.link-a:after { content:" - "; }

.link-p { display:inline; }`

};
