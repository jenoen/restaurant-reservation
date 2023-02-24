import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NewReservation from "../reservations/NewReservationForm";
import NotFound from "./NotFound";
import useQuery from "../utils/useQuery";
import CreateNewTable from "../tables/CreateNewTable";
import ReservationSeating from "../reservations/ReservationSeating";
import Search from "../search/Search";
import { today } from "../utils/date-time";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  // shorthand variables
  const query = useQuery();
  const date = query.get("date");

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  // useEffect will call the loadDashboard function every time the 'date' variable changes
  useEffect(loadDashboard, [date]);

  /**
   * Grabs all current reservations and tables from an API call.
   */
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    setTablesError(null);

    // API call
    listReservations({ date: date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal)
      .then((tables) =>
        tables.sort((tableA, tableB) => tableA.table_id - tableB.table_id)
      )
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={`/dashboard`} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={`/dashboard`} />
      </Route>
      <Route path="/dashboard">
        <Dashboard
          date={date ? date : today()}
          reservations={reservations}
          reservationsError={reservationsError}
          tables={tables}
          tablesError={tablesError}
          loadDashboard={loadDashboard}
        />
      </Route>

      <Route exact={true} path="/reservations/new">
        <NewReservation loadDashboard={loadDashboard} />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/seat">
        <ReservationSeating
          reservations={reservations}
          tables={tables}
          loadDashboard={loadDashboard}
        />
      </Route>

      <Route path="/reservations/:reservation_id/edit">
        <NewReservation
          loadDashboard={loadDashboard}
          edit={true}
          reservations={reservations}
        />
      </Route>
      <Route exact={true} path="/tables/new">
        <CreateNewTable loadDashboard={loadDashboard} />
      </Route>

      <Route path="/search">
        <Search />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
