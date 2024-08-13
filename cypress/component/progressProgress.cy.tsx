import React from "react";
import { Progress } from "@/app/_components/ui/Progress";
import "/app/globals.css";

describe("<Progress />", () => {
  it("should be able to render the correct progress", () => {
    cy.mount(<Progress value={50} />);
    cy.get("#progress")
      .should("have.attr", "style")
      .and("include", "transform: translateX(-50%);");
  });

  // it("should be able to change the progress", () => {
  //   cy.mount(<Progress value={progress} />);
  //   cy.get("#progress")
  //     .should("have.attr", "style")
  //     .and("include", "transform: translateX(-100%);");
  //   cy.
  //   cy.get("#progress")
  //     .should("have.attr", "style")
  //     .and("include", "transform: translateX(-50%);");
  // });
});
