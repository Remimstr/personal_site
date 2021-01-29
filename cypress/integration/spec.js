import projects from "../../src/projects";

describe("Homepage Tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  [
    { title: "Resume", href: "https://resume.remimstr.com" },
    { title: "Github", href: "https://github.com/remimstr" },
  ].forEach(({ title, href }) => {
    it(`Navigates to ${title}`, () => {
      cy.get("nav a").contains(title).should("have.attr", "href", href);
    });
  });

  it("Navigates to the about page", () => {
    cy.get("nav a").contains("About Me").click();
    cy.url().should("include", "/about");
  });

  projects.forEach((project, index) => {
    const { title, description, readMore } = project;
    it(`Finds project with title ${title}`, () => {
      cy.getBySel("project-card")
        .eq(index)
        .within((element) => {
          cy.get("h1").contains(title);
          cy.get("p").contains(description);
          cy.get("a")
            .contains("Learn More")
            .should("have.attr", "href", readMore);
        });
    });
  });
});
