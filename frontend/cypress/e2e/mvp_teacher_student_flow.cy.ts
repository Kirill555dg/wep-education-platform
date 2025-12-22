describe("MVP: teacher creates content, student completes it", () => {
  it("teacher -> create classroom/lesson/homework; student -> join + submit answer", () => {
    const className = `E2E Class ${Date.now()}`;
    const subject = "Math";
    const lessonTitle = `E2E Lesson ${Date.now()}`;
    const hwTitle = `E2E HW ${Date.now()}`;
    const problemTitle = "2+2";
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
      .as("createdClassroom")
      .within(() => {
        cy.get("[data-testid=invite-code]")
          .invoke("text")
          .then((text) => cy.wrap(text.trim()).as("inviteCode"));
        cy.contains("Открыть").click();
      });

    cy.url()
      .should("match", /\/teacher\/classrooms\/\d+$/)
      .then((url) => {
        const m = url.match(/\/teacher\/classrooms\/(\d+)$/);
        expect(m).to.not.be.null;
        cy.wrap(Number(m![1])).as("classroomId");
      });

    cy.get("[data-testid=create-lesson-open]").click();
    cy.get("[data-testid=create-lesson-title]").type(lessonTitle);
    cy.get("[data-testid=create-lesson-submit]").click();

    cy.contains("[data-testid=lesson-row]", lessonTitle).within(() => {
      cy.contains("Открыть").click();
    });

    cy.url()
      .should("match", /\/teacher\/lessons\/\d+$/)
      .then((url) => {
        const m = url.match(/\/teacher\/lessons\/(\d+)$/);
        expect(m).to.not.be.null;
        cy.wrap(Number(m![1])).as("lessonId");
      });

    cy.get("[data-testid=create-homework-open]").click();
    cy.get("[data-testid=create-homework-title]").type(hwTitle);
    cy.get("[data-testid=create-problem-title]").type(problemTitle);
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

    cy.get("@classroomId").then((classroomId) => {
      cy.get(`[data-testid=open-classroom-${classroomId}]`).click();
    });

    cy.get("@lessonId").then((lessonId) => {
      cy.get(`[data-testid=open-lesson-${lessonId}]`).click();
    });

    cy.get("@homeworkId").then((homeworkId) => {
      cy.get(`[data-testid=open-homework-${homeworkId}]`).click();
    });

    cy.get("[data-testid=answer]").type(correctAnswer);
    cy.get("[data-testid=submit-answer]").click();
    cy.contains("Ответ отправлен").should("exist");
  });
});


