describe("MVP: realtime chat", () => {
  it("teacher can send a message and see it in chat", () => {
    const className = `E2E Chat Class ${Date.now()}`;
    const subject = "Physics";
    const message = `hello-${Date.now()}`;

    cy.registerUser("teacher").then(({ email, password }) => {
      cy.loginUi(email, password);
      cy.url().should("include", "/teacher");
    });

    cy.get("[data-testid=create-classroom-open]").click();
    cy.get("[data-testid=create-classroom-name]").type(className);
    cy.get("[data-testid=create-classroom-subject]").type(subject);
    cy.get("[data-testid=create-classroom-submit]").click();

    cy.contains("[data-testid=classroom-card]", className).within(() => {
      cy.contains("Открыть").click();
    });

    cy.get("[data-testid=chat-input]").type(message);
    cy.get("[data-testid=chat-send]").click();

    cy.get("[data-testid=chat-message-list]").should("contain.text", message);
  });
});


