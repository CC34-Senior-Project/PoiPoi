import React from "react";
import { Button } from "./button";
import "../../globals.css";

describe("<Button />", () => {
  it("should contains default variant", () => {
    cy.mount(<Button>Hello</Button>);
    cy.get("button").should(
      "have.class",
      "bg-primary text-primary-foreground hover:bg-primary/90"
    );
  });

  it("should contains secondary variant", () => {
    cy.mount(<Button variant={"secondary"}>Delete</Button>);
    cy.get("button").should(
      "have.class",
      "bg-secondary text-secondary-foreground hover:bg-secondary/80"
    );
  });

  it("should contains destructive variant", () => {
    cy.mount(<Button variant={"destructive"}>Delete</Button>);
    cy.get("button").should(
      "have.class",
      "bg-destructive text-destructive-foreground hover:bg-destructive/90"
    );
  });

  it("should contains outline variant", () => {
    cy.mount(<Button variant={"outline"}>Delete</Button>);
    cy.get("button").should(
      "have.class",
      "border border-secondary bg-background hover:bg-secondary hover:text-accent-foreground"
    );
  });

  it("should contains ghost variant", () => {
    cy.mount(<Button variant={"ghost"}>Delete</Button>);
    cy.get("button").should(
      "have.class",
      "hover:bg-secondary hover:text-accent-foreground"
    );
  });

  it("should contains link variant", () => {
    cy.mount(<Button variant={"link"}>Delete</Button>);
    cy.get("button").should(
      "have.class",
      "text-primary underline-offset-4 hover:underline"
    );
  });

  it("should have ratio 1:1 when attribute size is icon", () => {
    cy.mount(<Button size={"icon"}>Delete</Button>);
    cy.get("button").then((button) => {
      const width = button.width();
      const height = button.height();
      expect(width).to.equal(height);
    })
  });
});
