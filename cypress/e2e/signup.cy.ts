import { faker } from "@faker-js/faker";

describe("signup", () => {
  it("Should make a successful signup", () => {
    cy.visit("/signup");
    cy.get("input[name=fullname]").type(faker.person.fullName());
    cy.get("input[name=email]").type(faker.internet.email());
    cy.get("input[name=password]").type("password123");
    cy.get("input[name=confirmPassword]").type("password123");
    cy.get("button[type=submit]").click();
    cy.wait(200);
    cy.getCookie("session").should("exist");
    cy.url().should("include", "/tasks");
    const title = faker.lorem.sentence();
    cy.get("#taskTitle").type(title);
    cy.get("#taskTitle").type("{enter}");
    cy.wait(500);
    cy.contains(title);
  });
  it("Should fail if email already exists", () => {
    cy.visit("/signup");
    cy.get("input[name=fullname]").type("John Doe");
    cy.get("input[name=email]").type("john@mail.com");
    cy.get("input[name=password]").type("password123");
    cy.get("input[name=confirmPassword]").type("password123");
    cy.get("button[type=submit]").click();
    cy.url().should("include", "/signup");
  });
  it("Should fail if passwords do not match", () => {
    cy.visit("/signup");
    cy.get("input[name=fullname]").type("John Doe");
    cy.get("input[name=email]").type(faker.internet.email());
    cy.get("input[name=password]").type("password123");
    cy.get("input[name=confirmPassword]").type("password1234");
    cy.get("button[type=submit]").click();
    cy.contains("Passwords do not match");
  });
});
