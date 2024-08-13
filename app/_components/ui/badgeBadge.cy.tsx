import React from "react";
import { Badge } from "./badge";
import "../../globals.css";

describe("<Badge />", () => {
  it("should contains default variant", () => {
    cy.mount(<Badge>Nature</Badge>);
    cy.get("div").should(
      "have.class",
      "border-transparent bg-primary text-primary-foreground hover:bg-primary/80"
    );
  });

  it("should contains secondary variant", () => {
    cy.mount(<Badge variant="secondary">Nature</Badge>);
    cy.get("div").should(
      "have.class",
      "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
    );
  });

  it("should contains destructuve variant", () => {
    cy.mount(<Badge variant="destructive">Nature</Badge>);
    cy.get("div").should(
      "have.class",
      "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80"
    );
  });

  it("should contains outline variant", () => {
    cy.mount(<Badge variant="outline">Nature</Badge>);
    cy.get("div").should("have.class", "text-foreground");
  });

  it("should contains button variant", () => {
    cy.mount(<Badge variant="button">Nature</Badge>);
    cy.get("div").should(
      "have.class",
      "text-primary hover:text-primary/80 bg-white"
    );
  });
});
