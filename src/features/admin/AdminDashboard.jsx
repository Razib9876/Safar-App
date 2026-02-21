import React from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="tabs tabs-lift">
      <input type="radio" name="my_tabs_3" className="tab" aria-label="Tab 1" />
      <div className="tab-content bg-base-100 border-base-300 p-6">
        Tab content 1
      </div>

      <input
        type="radio"
        name="my_tabs_3"
        className="tab"
        aria-label="Tab 2"
        defaultChecked
      />
      <div className="tab-content bg-base-100 border-base-300 p-6">
        Tab content 2
      </div>

      <input type="radio" name="my_tabs_3" className="tab" aria-label="Tab 3" />
      <div className="tab-content bg-base-100 border-base-300 p-6">
        Tab content 3
      </div>
    </div>
  );
}
