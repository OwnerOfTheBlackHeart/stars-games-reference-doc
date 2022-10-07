export class Time {
	day: number;
	month: number;
	year: number;

	constructor(day?: number, month?: number, year?: number) {
		if (day != undefined) {
			this.day = day;
		} else {
			this.day = 0;
		}

		if (month != undefined) {
			this.month = month;
		} else {
			this.month = 0;
		}

		if (year != undefined) {
			this.year = year;
		} else {
			this.year = 0;
		}
	}

	toString(doesIncludeSeason = false) {
		let toReturn = "";
		let tempTime = this.DistributeDays();
		let month = TimeRef.months[tempTime.month];
		let numeralAbbreviation = " ";

		if ([10, 11, 12].some((day) => day === tempTime.day)) {
			numeralAbbreviation = "th";
		} else {
			switch (tempTime.day % 10) {
				case 0:
					numeralAbbreviation = "st";
					break;
				case 1:
					numeralAbbreviation = "nd";
					break;
				case 2:
					numeralAbbreviation = "rd";
					break;
				default:
					numeralAbbreviation = "th";
			}
		}

		toReturn += month.name + " ";
		toReturn += tempTime.day + 1 + numeralAbbreviation + ", ";
		toReturn += tempTime.year;

		if (doesIncludeSeason) {
			toReturn += ": " + month.season;
		}

		return toReturn;
	}

	Add(time2: Time) {
		return Time.Add(this, time2);
	}

	Subtract(time2: Time) {
		return Time.Subtract(this, time2);
	}

	ToDays() {
		return Time.ToDays(this);
	}

	DistributeDays() {
		let tempTime = new Time();
		let days = this.ToDays();
		let multiplier = 0;

		// Years
		multiplier = Time.YearsToDays(1);
		tempTime.year = Math.floor(days / multiplier);
		days -= multiplier * tempTime.year;

		// Months
		multiplier = Time.MonthsToDays(1);
		tempTime.month = Math.floor(days / multiplier);
		days -= multiplier * tempTime.month;
		tempTime.day = days;

		return tempTime;
	}

	Compare(b: Time) {
		if (!b) {
			return 1;
		}

		if (this.year === b.year) {
			if (this.month === b.month) {
				if (this.day === b.day) {
					return 0;
				} else {
					return this.day - b.day;
				}
			} else {
				return this.month - b.month;
			}
		} else {
			return this.year - b.year;
		}
	}

	static FromInitializer(initializer: DateInitializer) {
		return new Time(initializer.day, initializer.month, initializer.year);
	}

	static Add(time1: Time, time2: Time) {
		let toReturn = new Time();
		toReturn.day = time1.ToDays() + time2.ToDays();

		toReturn = toReturn.DistributeDays();

		return toReturn;
	}

	static Subtract(time1: Time, time2: Time) {
		let toReturn = new Time();
		toReturn.day = time1.ToDays() - time2.ToDays();

		toReturn = toReturn.DistributeDays();

		return toReturn;
	}

	static ToDays(time: Time) {
		let tempTime = Time.CleanTime(time);
		let toReturn = tempTime.day;

		toReturn += Time.YearsToDays(tempTime.year);
		toReturn += Time.MonthsToDays(tempTime.month);

		return toReturn;
	}

	static BuildDiffString(currentTime: Time, toDiffTime: Time) {
		if (!currentTime || !toDiffTime) {
			return undefined;
		}

		let offset: Time;
		let daysDifference = currentTime.ToDays() - toDiffTime.ToDays();
		let toReturn = "";

		// Get offset or return 0
		if (daysDifference > 0) {
			offset = currentTime.Subtract(toDiffTime).DistributeDays();
		} else if (daysDifference < 0) {
			offset = toDiffTime.Subtract(currentTime).DistributeDays();
		} else {
			return "Current date";
		}

		// Build days, months, and years
		if (offset.year > 0) {
			toReturn += offset.year.toString() + (offset.year > 1 ? " years" : " year");
		}

		if (offset.month > 0) {
			if (toReturn.length > 0) {
				toReturn += ", ";
			}
			toReturn += offset.month.toString() + (offset.month > 1 ? " months" : " month");
		}

		if (offset.day > 0) {
			if (toReturn.length > 0) {
				toReturn += " and ";
			}
			toReturn += offset.day.toString() + (offset.day > 1 ? " days" : " day");
		}

		// Ago or From Now
		if (daysDifference > 0) {
			toReturn += " ago";
		} else if (daysDifference < 0) {
			toReturn += " from now";
		}

		return toReturn;
	}

	static WeeksToDays(weeks: number) {
		return weeks * TimeRef.daysPerWeek;
	}

	static MonthsToDays(months: number) {
		return Time.WeeksToDays(months * TimeRef.weeksPerMonth);
	}

	static YearsToMonths(years: number) {
		return years * TimeRef.monthsPerYear;
	}

	static YearsToDays(years: number) {
		return Time.MonthsToDays(Time.YearsToMonths(years));
	}

	static CleanTime(time: Time) {
		return time;
	}

	static Compare(a: Time, b: Time) {
		if (a === b) {
			return 0;
		} else if (a && !b) {
			return 1;
		} else if (!a && b) {
			return -1;
		} else {
			return a.Compare(b);
		}
	}
}

export interface DateInitializer {
	day: number;
	month: number;
	year: number;
}

export enum Season {
	Summer = "summer",
	Spring = "spring",
	Fall = "fall",
	Winter = "winter",
}

export class Month {
	name: string;
	position: number;
	season: Season;

	constructor(name: string, position: number, season: Season) {
		this.name = name;
		this.position = position;
		this.season = season;
	}

	static readonly January = new Month("January", 0, Season.Winter);
	static readonly February = new Month("February", 1, Season.Winter);
	static readonly March = new Month("March", 2, Season.Spring);
	static readonly April = new Month("April", 3, Season.Spring);
	static readonly May = new Month("May", 4, Season.Spring);
	static readonly June = new Month("June", 5, Season.Summer);
	static readonly July = new Month("July", 6, Season.Summer);
	static readonly August = new Month("August", 7, Season.Summer);
	static readonly September = new Month("September", 8, Season.Fall);
	static readonly October = new Month("October", 9, Season.Fall);
	static readonly November = new Month("November", 10, Season.Fall);
	static readonly December = new Month("December", 11, Season.Winter);
}

export class TimeRef {
	static readonly daysPerWeek = 7;
	static readonly weeksPerMonth = 4;
	static readonly monthsPerYear = 12;

	static readonly months = [
		Month.January,
		Month.February,
		Month.March,
		Month.April,
		Month.May,
		Month.June,
		Month.July,
		Month.August,
		Month.September,
		Month.October,
		Month.November,
		Month.December,
	];
}
