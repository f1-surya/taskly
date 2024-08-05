describe("login", () => {
  it("Successful login", () => {
    cy.visit("/login");
    cy.get("input[name=email]").type("john@mail.com");
    cy.get("input[name=password]").type("password123");
    cy.get("button[type=submit]").click();
    cy.url().should("include", "/tasks");
    cy.getCookie("session").should("exist");
  });
  it("Failed login due to wrong password", () => {
    cy.visit("/login");
    cy.get("input[name=email]").type("john@mail.com");
    cy.get("input[name=password]").type("password1234");
    cy.get("button[type=submit]").click();
    cy.url().should("include", "/login");
    cy.getCookie("session").should("not.exist");
    cy.contains("Wrong password");
  });
  it("Failed login due to wrong email", () => {
    cy.visit("/login");
    cy.get("input[name=email]").type("john@mail");
    cy.get("input[name=password]").type("password123");
    cy.get("button[type=submit]").click();
    cy.url().should("include", "/login");
    cy.getCookie("session").should("not.exist");
    cy.contains("Email not found");
  });
});
