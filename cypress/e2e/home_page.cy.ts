describe("Test root redirection", () => {
  it("Redirects", () => {
    cy.visit("/");
    cy.getCookie("session").then((val) => {
      if (val) {
        cy.url().should("include", "/tasks");
      } else {
        cy.url().should("include", "/login");
      }
    });
  });
});
