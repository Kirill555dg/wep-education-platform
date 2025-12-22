describe("Smoke: teacher core flow", () => {
  it("teacher can create classroom and lesson and see invite code", () => {
    const className = `Smoke Class ${Date.now()}`;
    const subject = "Math";
    const lessonTitle = `Smoke Lesson ${Date.now()}`;

    cy.registerUser("teacher").then(({ email, password }) => {
      cy.loginUi(email, password);
      cy.get("[data-testid=teacher-title]", { timeout: 15000 }).should("be.visible");
    });

    cy.get("[data-testid=create-classroom-open]").click();
    cy.get("[data-testid=create-classroom-name]").type(className);
    cy.get("[data-testid=create-classroom-subject]").type(subject);
    cy.get("[data-testid=create-classroom-submit]").click();

    cy.contains("[data-testid=classroom-card]", className).within(() => {
      cy.get("[data-testid=invite-code]").invoke("text").should("match", /\S+/);
      cy.contains("Открыть").click();
    });

    cy.get("[data-testid=create-lesson-open]").click();
    cy.get("[data-testid=create-lesson-title]").type(lessonTitle);
    cy.get("[data-testid=create-lesson-submit]").click();

    cy.contains("[data-testid=lesson-row]", lessonTitle).should("exist");
  });
});


