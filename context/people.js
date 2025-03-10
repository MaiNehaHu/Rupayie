import { useContext } from "react";
import { useState } from "react";

const Server_API = "https://expense-trackerr-server.vercel.app/api";

const { createContext } = require("react");

const PeopleContext = createContext();

export const PeopleProvider = ({ children }) => {
  const [savingPerson, setSavingPerson] = useState(false);
  const [deletingPerson, setDeletingPerson] = useState(false);

  async function addPerson(values) {
    try {
      setSavingPerson(true);
      const response = await fetch(`${Server_API}/people/Ru-dfrhm8399izhum`, {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        setSavingPerson(false);
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add Person");
      }

      const data = await response.json();

      setSavingPerson(false);
      console.log("Person Added Successfully");

      return data.person;
    } catch (error) {
      console.log("Error Adding Person: ", error);
      throw new Error("Error Adding Person");
    }
  }

  async function saveEditedPerson(personId, values) {
    try {
      setSavingPerson(true);

      const response = await fetch(
        `${Server_API}/people/Ru-dfrhm8399izhum/${personId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        setSavingPerson(false);
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to Edit Person");
      }

      setSavingPerson(false);
      console.log("Person Editting Successfully");
    } catch (error) {
      console.log("Error Editting Person: ", error);
      throw new Error("Error Editting Person");
    }
  }

  async function deletePerson(personId) {
    try {
      setDeletingPerson(true);

      const response = await fetch(
        `${Server_API}/people/Ru-dfrhm8399izhum/${personId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        setDeletingPerson(false);
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to Delete Person");
      }

      setDeletingPerson(false);
      console.log("Person Delete Successfully");
    } catch (error) {
      console.log("Error Delete Person: ", error);
      throw new Error("Error Delete Person");
    }
  }

  return (
    <PeopleContext.Provider
      value={{
        addPerson,
        saveEditedPerson,
        deletePerson,
        savingPerson,
        deletingPerson,
      }}
    >
      {children}
    </PeopleContext.Provider>
  );
};

export const usePeople = () => useContext(PeopleContext);
