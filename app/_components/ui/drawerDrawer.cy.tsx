import React from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "./drawer";
import "../../globals.css";

describe("<Drawer />", () => {
  beforeEach(() => {
    cy.mount(
      <Drawer>
        <DrawerTrigger>
          <button id="trigger">Open</button>
        </DrawerTrigger>
        <DrawerContent>
          <div id="content">This is Drawer Content</div>
        </DrawerContent>
      </Drawer>
    );
  });

  it("should be able to trigger and open the Drawer content", () => {
    cy.get("#content").should("not.exist");
    cy.get("#trigger").click();
    cy.get("#content").should("exist");
  });

  it("should be able to close the drawer", () => {
    cy.get("#trigger").click();
    cy.get("#content").should("exist");
    cy.get("body").click(0, 0, { force: true });
    cy.get("#content").should("not.exist");
  });
});
