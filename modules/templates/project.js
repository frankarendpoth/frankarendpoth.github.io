/* Frank Poth 2020-01-05 */

export const Project = {

  getHTML(name, description, url) {
  
    return `<div class = "project">
  <a class = "project-a" href = "${url}">${name}</a>
  <p class = "project-p">${description}</p>
</div>`;
  
  },

  style:`.project {

  display:block;
  margin:4px 0px;

}

.project-a {

  background-color:var(--color-signature-gray);
  color:#f0c000;
  display:inline-block;
  padding:4px;

}

.project-a:hover {

  background-color:var(--color-medium-gray);

}

.project-p {

  display:inline;

}`

};