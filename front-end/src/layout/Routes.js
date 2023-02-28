import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { today } from "../utils/date-time";

import NotFound from "./NotFound";
import Dashboard from "../dashboard/Dashboard";
import NewReservation from "../reservations/NewReservationForm";
import NewTable from "../tables/NewTable";
import Seat from "../reservations/Seat.js";
import Search from "../search/Search";
import EditReservation from "../reservations/EditReservation";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  // const [reservations, setReservations] = useState([]);
  // const [reservationsError, setReservationsError] = useState(null);
  // const [tables, setTables] = useState([]);
  // const [tablesError, setTablesError] = useState(null);

  // // useEffect will call the loadDashboard function every time the 'date' variable changes
  // useEffect(loadDashboard, [date]);

  // /**
  //  * Grabs all current reservations and tables from an API call.
  //  */
  // function loadDashboard() {
  //   const abortController = new AbortController();
  //   setReservationsError(null);
  //   setTablesError(null);

  //   // API call
  //   listReservations({ date: date }, abortController.signal)
  //     .then(setReservations)
  //     .catch(setReservationsError);
  //   listTables(abortController.signal)
  //     .then((tables) =>
  //       tables.sort((tableA, tableB) => tableA.table_id - tableB.table_id)
  //     )
  //     .then(setTables)
  //     .catch(setTablesError);
  //   return () => abortController.abort();
  // }

  return (
    <Switch>
      {/* goes to dashboard redirects */}
      <Route exact={true} path="/">
        <Redirect to={`/dashboard`} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={`/dashboard`} />
      </Route>
      <Route path="/dashboard">
        <Dashboard today={today()} />
      </Route>
      <Route path="/dashboard/:date">
        <Dashboard />
      </Route>

      {/* reservations pages */}
      <Route exact={true} path="/reservations/new">
        <NewReservation />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/seat">
        <Seat />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <EditReservation />
      </Route>

      {/* tables pages */}
      <Route path="/tables/new">
        <NewTable />
      </Route>

      {/* search */}
      <Route exact={true} path="/search">
        <Search />
      </Route>

      {/* not found */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
