describe("Auth", () => {
  it("register -> login -> logout (teacher)", () => {
    cy.registerUser("teacher").then(({ email, password }) => {
      cy.loginUi(email, password);
    });
    cy.url().should("include", "/teacher");
    cy.get("[data-testid=role-badge]").should("contain.text", "teacher");
    cy.logoutUi();
  });

  it("invalid credentials show error", () => {
    const email = `bad-${Date.now()}@e2e.wep.dev`;
    cy.visit("/login");
    cy.get("[data-testid=login-email]").type(email);
    cy.get("[data-testid=login-password]").type("wrong-password");
    cy.get("[data-testid=login-submit]").click();

    cy.get("[data-testid=login-error]").should("be.visible");
    cy.url().should("include", "/login");
  });
});

