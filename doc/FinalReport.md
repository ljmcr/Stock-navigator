# Final Report

## Please list out changes in the directions of your project if the final project is different from your original proposal (based on your stage 1 proposal submission).

We did not have major changes but only minor design choices. We changed the slide bar for the period selector to a calendar instead for ease of use. We also decided to change the frequencies from weekly, monthly, and annually to daily, monthly, and annually because working with daily data is much more efficient than aggregating based on weeks.

Apart from that, we also decided to search the stock by using exact match when we are searching by the stock’s industry, instead of ‘substring search’ like when we search for stocks using its name and company name.

## Discuss what you think your application achieved or failed to achieve regarding its usefulness.

We achieved all of the functionalities that we planned to implement at first. We successfully displayed the stock price data for various markets with multiple currencies and with time constraints. We allow users to search for stock using its name, abbreviation, company name, and industry. We also handled user authentication and offered the choice between a default and favorite view for better functionality as intended.

However, we failed to add some user-friendly features that we’ve planned to implement if we have extra time left (which we barely do), such as allowing them to select the dark or bright mode of the webpage or the display color for each of the stock in the plot. We could provide more options for the users to customize the display. 

## Discuss if you changed the schema or source of the data for your application

We did not change either of them. 

## Discuss what you change to your ER diagram and/or your table implementations. What are some differences between the original design and the final design? Why? What do you think is a more suitable design? 

We have no changes in the ER diagram and table implementations.

## Discuss what functionalities you added or removed. Why?

We changed the period selector to a calendar since it was easier for users. If we were to use a slide bar, we would have to implement different slide intervals based on the selected frequency. Otherwise, it would be very hard to select a specific start and end date. 

Moreover, as discussed above, for the stock searching with industry name, we only allow exact search (instead of substring search). However, as it comes with the MUI components, we selected the table that have built-in functionality to sort stocks based on the columns (which are ID, stock name, stock company name, and average closing price), so this is an added feature.

## Explain how you think your advanced database programs complement your application.

Our advanced database programs complemented our application because it allowed user data, including their favorites, company data, and stock data to be efficiently managed and queried. We implemented complicated logics within our stored procedures and apply constraints on our table, so that the logic in our frontend can be simple and clean. We are able to fetch the data and display them on the front-end efficiently due to our well-planned database schema and stored procedures.

## Each team member should describe one technical challenge that the team encountered.  This should be sufficiently detailed such that another future team could use this as helpful advice if they were to start a similar project or where to maintain your project. 

- `Jake Wang`: 

- `Kantanat Pridaphatrakun`: I encountered problems when creating the plot. This was mainly because summarizing raw data and displaying it requires careful parsing and management of data structures among different classes. If someone were to work on a similar project, I would recommend them to plan out carefully beforehand what data will be needed for the plot, and how it should be formatted. They should refer to documentation and understand how the designated chart library works (such as chart.js). Then, they can ensure that the queried data can be efficiently managed and formatted in the appropriate way. 

- `Rachanon Petchoo`: During the previous stages, we did not think about how we would handle the currency exchange data for missing dates. As I am responsible for the part, I was thinking about using hard-coded default exchange rate for each currency, which would required another table and changes to our ER diagram (also, hard-coding is not really a good practice). Therefore, I solved the problem by performing left join on the stock prices in USD (as the left table) and currency exchange data table (as the right table), so that for any date with missing currency exchange rate, we would still have the row (as it is left join). We then populate the NULL entry for rows missing the currency exchange with the average exchange rate for that currency from all of the data that we have available. This way, the default currency rate is not hard-coded and no changes to our schema is needed. This could be further improved by populating it with the average exchange rate for only +-7 days interval to better reflect the trend of exchange rate during that period.

- `Jiaming Li`: I encountered the problem when I needed to read a specific value from another component. We all create a new component for different parts of the webpage and it is not possible for React to read the values directly from a different component. I have to do a lot of research in order to solve this problem, then I find a solution to utilize the Context feature of React. In this case, we put all the values that we want to share between different components under the same Context Provider, then we use the get and set method from Context Provider to read and update those shared values within different components. We also developed a way to put all the shared values together within the same Context Provider at the end of the stage, which increases the efficiency of future development.

## Are there other things that changed comparing the final application with the original proposal?

No, all the changes are mentioned above.

## Describe future work that you think, other than the interface, that the application can improve on

For future use, we could allow users to add another stock which is not currently in the database. Currently, we can only allow users to play with data existed in the database. We could also allow them to update the currency conversion rate or the price information of the stocks on a specific day based on real-time data (or we could also connect to an API to pull the data for them and update it daily). Instead of raw prices, we could also implement percent change for users to more efficiently track the performance of different stocks with different prices. With the current implementation, it is harder to compare the performance of stocks with marginally different prices without analyzing them individually.

## Describe the final division of labor and how well you managed teamwork.

We divided the work beforehand for the proposal, and stayed consistent with the plan. We had frequent meetings to discuss our progress and also if anyone needed help with their part. We divided the work pretty evenly, but there are times when those who are more experienced with the language/framework offered to help out others. Overall, we were able to work and communicate effectively and efficiently with each other and produced satisfactory results.
