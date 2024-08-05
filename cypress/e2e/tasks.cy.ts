import { faker } from "@faker-js/faker";

describe("tasks", () => {
  beforeEach(() => {
    cy.login("john@mail.com", "password123");
  });
  it("should create a task", () => {
    cy.visit("/tasks");
    cy.get(".tasks").should("be.visible");
    const title = faker.lorem.lines(1);
    cy.get("#taskTitle").type(title);
    cy.get("#taskTitle").type("{enter}");
    cy.wait(500);
    cy.contains(title);
  });

  it("should warn if the title is empty", () => {
    cy.visit("/tasks");
    cy.get("#taskTitle").type("{enter}");
    cy.wait(300);
    cy.contains("Title cannot be empty");
  });

  it("should change the status of the task", () => {
    cy.visit("/tasks");
    cy.get(".tasks").should("be.visible");
    cy.get(".task").first().click();
    cy.wait(200);
    cy.url().then((location) => {
      const words = location.split("/");
      const id = words[words.length - 1];
      expect(id).to.be.a("string");
      cy.log(id);
      cy.intercept("PUT", "/api/task").as("updateTask");
      cy.get(`#checkBox-${id}`).click();
      cy.wait("@updateTask").then((interception) => {
        expect(interception.response?.statusCode).to.equal(201);
      });
    });
  });

  it("should edit description", () => {
    cy.visit("/tasks");
    cy.get(".task").first().click();
    cy.wait(200);
    cy.intercept("PUT", "/api/task").as("updateTask");
    cy.get("textarea[name=description]").type(faker.lorem.paragraph());
    cy.wait("@updateTask").then((interception) => {
      expect(interception.response?.statusCode).to.equal(201);
    });
  });

  it("should delete task", () => {
    cy.visit("/tasks");
    cy.get(".task").first().click();
    cy.wait(200);
    cy.intercept("DELETE", "/api/task").as("deleteTask");
    cy.get("#deleteTask").first().click();
    cy.wait(200);
    cy.contains("Delete").click();
    cy.wait("@deleteTask").then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
    });
  });
});
