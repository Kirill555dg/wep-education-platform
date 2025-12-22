describe("Smoke: student progress", () => {
  it("after submitting an answer, student sees progress card updated", () => {
    const className = `Smoke Progress Class ${Date.now()}`;
    const subject = "Physics";
    const lessonTitle = `Smoke Progress Lesson ${Date.now()}`;
    const hwTitle = `Smoke Progress HW ${Date.now()}`;
    const correctAnswer = "4";

    cy.registerUser("teacher").then(({ email, password }) => {
      cy.loginUi(email, password);
      cy.url().should("include", "/teacher");
    });

    cy.get("[data-testid=create-classroom-open]").click();
    cy.get("[data-testid=create-classroom-name]").type(className);
    cy.get("[data-testid=create-classroom-subject]").type(subject);
    cy.get("[data-testid=create-classroom-submit]").click();

    cy.contains("[data-testid=classroom-card]", className)
      .within(() => {
        cy.get("[data-testid=invite-code]")
          .invoke("text")
          .then((text) => cy.wrap(text.trim()).as("inviteCode"));
        cy.contains("Открыть").click();
      });

    cy.get("[data-testid=create-lesson-open]").click();
    cy.get("[data-testid=create-lesson-title]").type(lessonTitle);
    cy.get("[data-testid=create-lesson-submit]").click();
    cy.contains("[data-testid=lesson-row]", lessonTitle).within(() => {
      cy.contains("Открыть").click();
    });

    cy.get("[data-testid=create-homework-open]").click();
    cy.get("[data-testid=create-homework-title]").type(hwTitle);
    cy.get("[data-testid=create-problem-title]").type("2+2");
    cy.get("[data-testid=create-problem-description]").type("Сколько будет 2 + 2?");
    cy.get("[data-testid=create-problem-answer]").type(correctAnswer);
    cy.get("[data-testid=create-homework-submit]").click();

    cy.contains("[data-testid=homework-row]", hwTitle)
      .find("[data-testid^=open-homework-]")
      .invoke("attr", "href")
      .then((href) => {
        expect(href).to.match(/\/student\/homeworks\/\d+$/);
        const m = href!.match(/\/student\/homeworks\/(\d+)$/);
        cy.wrap(Number(m![1])).as("homeworkId");
      });

    cy.logoutUi();

    cy.registerUser("student").then(({ email, password }) => {
      cy.loginUi(email, password);
      cy.url().should("include", "/student");
    });

    cy.get("@inviteCode").then((inviteCode) => {
      cy.get("[data-testid=join-invite-code]").type(String(inviteCode));
      cy.get("[data-testid=join-submit]").click();
    });

    // Navigate to homework directly and submit an answer.
    cy.get("@homeworkId").then((homeworkId) => {
      cy.visit(`/student/homeworks/${homeworkId}`);
    });

    cy.get("[data-testid=answer]").type(correctAnswer);
    cy.get("[data-testid=submit-answer]").click();
    cy.contains("Ответ отправлен").should("exist");

    // Go to student home and assert progress card has data (>= 1 homework).
    cy.visit("/student");
    cy.contains("Мой прогресс").should("exist");
    cy.contains(/Всего ДЗ:\s*[1-9]\d*/).should("exist");
  });
});


