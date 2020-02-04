/* Frank Poth 2020-01-02 */

import { Link }    from '/modules/templates/link.js';
import { Project } from '/modules/templates/project.js';

export const Page = {
  
  getHTML(callback) {

    fetch('pages/javascript-projects/data/projects.json').then(response => {

      return response.json();

    }).then(data => {

      callback(`<style>${this.style}</style>
      <style>${Link.style}</style>
      <style>${Project.style}</style>
      <span class = "title">JavaScript Projects!</span>
      ${Link.getHTML('Go Home!', 'Go home, young lad.', '#/pages/home/home.js')}
      <div id = "project_container">${(() => {

        var projects = '';

        for (var index = 0; index < data.length; index ++) {

          var project = data[index];

          projects += Project.getHTML(project.name, project.description, "pages/javascript-projects/content/" + project.path);

        }

        return projects;

      })()}</div>`);

    });

  },

  style:`.title {
    
  color:#ff9900;

}`
  
};