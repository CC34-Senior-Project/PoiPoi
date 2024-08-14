describe("Map", () => {
  beforeEach(() => {
    cy.viewport("iphone-8");
    cy.visit({
      url: "/map",
      method: "POST",
      headers: {
        "user-agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1",
      },
    });
  });

  it("should contains header menu", () => {
    cy.get("#headerMenu");
  });

  it("should contains footer menu", () => {
    cy.get("#footerMenu");
  });

  it("should contains main quest component", () => {
    cy.get("#mainQuest");
  });

  it("should contains map controller component", () => {
    cy.get("#mapControl");
  });

  it("should contains game map", () => {
    cy.get("#gameMap");
  });
});
