// new component for creating a new reservation
import React from "react";

// i named my component NewReservation:
export default function NewReservation() {
	return (
	<form>
        {/* First Name */}
		<label htmlFor="first_name">First Name:</label>
		<input
			name="first_name"
			id="first_name"
			type="text"
			onChange={} // we will add this in soon!
			value={} // this as well!
			required // this will make the field non-nullable
		/>

            {/* Last Name */}
		<label htmlFor="first_name">Last Name:</label>
		<input
			name="last_name"
			id="last_name"
			type="text"
			onChange={} // we will add this in soon!
			value={} // this as well!
			required // this will make the field non-nullable
		/>

            {/* Mobile Number */}
		<label htmlFor="mobile_number">Phone Number:</label>
		<input
			name="mobile_number"
			id="mobile_number"
			type="tel"
			onChange={} // we will add this in soon!
			value={} // this as well!
			required // this will make the field non-nullable
		/>

            {/* Date of reservation */}
		<label htmlFor="reservation_date">Reservation Date:</label>
		<input
			name="reservation_date"
			id="reservation_date"
			type="date"
			onChange={} // we will add this in soon!
			value={} // this as well!
			required // this will make the field non-nullable
		/>

            {/* Time of reservation */}
		<label htmlFor="reservation_time">Reservation Time:</label>
		<input
			name="reservation_time"
			id="reservation_time"
			type="time"
			onChange={} // we will add this in soon!
			value={} // this as well!
			required // this will make the field non-nullable
		/>

            {/* Number of ppl in party */}
		<label htmlFor="people">Total Number in Party:</label>
		<input
			name="people"
			id="people"
			type="number"
			onChange={} // we will add this in soon!
			value={} // this as well!
			required // this will make the field non-nullable
		/>
        
                   {/* button for submit*/}
	<button type="submit" onClick={}>Submit</button>
    {/* button for cancel*/}
	<button type="button" onClick={}>Cancel</button>
	</form> )
}
;