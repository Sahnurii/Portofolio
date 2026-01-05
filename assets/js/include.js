const sections = {
  header: 'header.html',
  hero: 'hero.html',
  about: 'about.html',
  skills: 'skills.html',
  projects: 'projects.html',
  organization: 'organization.html',
  experience: 'experience.html',
  contact: 'contact.html',
  footer: 'footer.html',
};

Object.entries(sections).forEach(([id, file]) => {
  fetch(`partials/${file}`)
    .then(res => res.text())
    .then(html => {
      const container = document.getElementById(id);
      if (!container) return;

      container.innerHTML = html;

      document.dispatchEvent(
        new CustomEvent("sectionLoaded", { detail: id })
      );
    })
    .catch(err => console.error(`Error loading ${file}:`, err));
});

