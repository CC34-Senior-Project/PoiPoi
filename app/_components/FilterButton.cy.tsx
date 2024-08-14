import React, { useState } from "react";
import FilterButton from "./FilterButton";
import "../globals.css";

import { filters } from "@/cypress/fixtures/filter";

const FilterButtonWrapper = () => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  return (
    <FilterButton
      filters={filters}
      selectedFilters={selectedFilters}
      setSelectedFilters={setSelectedFilters}
    />
  );
};

describe("<FilterButton />", () => {
  it("should be able to click and change state", () => {
    cy.mount(<FilterButtonWrapper />);
    cy.contains("Shopping").click();
    cy.wait(200);
    cy.contains("Nature").click();
    cy.wait(200);
    cy.get("#Shopping-filter").should("have.class", "bg-primary");
    cy.get("#Nature-filter").should("have.class", "bg-primary");
  });

  it("should be able to switch between active and inactive state", () => {
    cy.mount(<FilterButtonWrapper />);
    cy.contains("Shopping").click();
    cy.wait(200);
    cy.contains("Nature").click();
    cy.wait(200);
    cy.contains("Nature").click();
    cy.wait(200);
    cy.contains("Shopping").click();
    cy.wait(200);
    cy.contains("Anime").click();
    cy.get("#Anime-filter").should("have.class", "bg-primary");
    cy.get("#Shopping-filter").should("not.have.class", "bg-primary");
    cy.get("#Nature-filter").should("not.have.class", "bg-primary");
  });

  it("should not response to accidentally double-click", () => {
    cy.mount(<FilterButtonWrapper />);
    cy.get("#Anime-filter").click();
    cy.get("#Anime-filter").click();
    cy.get("#Anime-filter").should("have.class", "bg-primary");
  });
});
