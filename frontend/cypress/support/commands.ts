/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

export {};

const BACKEND_URL = Cypress.env("BACKEND_URL") || "http://127.0.0.1:8023";

declare global {
  namespace Cypress {
    interface Chainable {
      /** Register a new user via API and return credentials. */
      registerUser(role: "teacher" | "student"): Chainable<{ email: string; password: string }>;
      /** Login via UI. */
      loginUi(email: string, password: string): Chainable<void>;
      /** Logout via UI (header button). */
      logoutUi(): Chainable<void>;
    }
  }
}

Cypress.Commands.add("registerUser", (role: "teacher" | "student") => {
  const email = `${role}-${Date.now()}-${Math.floor(Math.random() * 10000)}@e2e.wep.dev`;
  const password = "TestPass123!";

  return cy
    .request("POST", `${BACKEND_URL}/api/v1/auth/register`, {
      email,
      password,
      first_name: role === "teacher" ? "Test" : "Student",
      last_name: role === "teacher" ? "Teacher" : "User",
      middle_name: null,
      role,
    })
    .then(() => ({ email, password }));
});

Cypress.Commands.add("loginUi", (email: string, password: string) => {
  cy.visit("/login");
  cy.get("[data-testid=login-email]").clear().type(email);
  cy.get("[data-testid=login-password]").clear().type(password);
  cy.get("[data-testid=login-submit]").click();
});

Cypress.Commands.add("logoutUi", () => {
  cy.get("[data-testid=logout]").click();
  cy.url().should("include", "/login");
});