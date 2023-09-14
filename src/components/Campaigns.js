import React, { useEffect, useState } from 'react'
import { DatePicker } from "antd"

const campaignsList = [
    { id: 1, name: "Divavu", startDate: "9/19/2021", endDate: "3/9/2023", Budget: 88377, userId: 3 },
    { id: 2, name: "Jaxspan", startDate: "11/21/2023", endDate: "2/21/2024", Budget: 608715, userId: 6 },
    { id: 3, name: "Miboo", startDate: "11/1/2022", endDate: "6/20/2022", Budget: 239507, userId: 7 },
    { id: 4, name: "Trilith", startDate: "8/25/2022", endDate: "11/30/2022", Budget: 179838, userId: 1 },
    { id: 5, name: "Layo", startDate: "11/28/2017", endDate: "3/10/2023", Budget: 837850, userId: 9 },
    { id: 6, name: "Photojam", startDate: "7/25/2019", endDate: "6/23/2021", Budget: 858131, userId: 3 },
    { id: 7, name: "Blogtag", startDate: "6/27/2019", endDate: "1/15/2021", Budget: 109078, userId: 2 },
    { id: 8, name: "Rhyzio", startDate: "10/13/2020", endDate: "1/25/2022", Budget: 272552, userId: 4 },
    { id: 9, name: "Zoomcast", startDate: "9/6/2021", endDate: "11/10/2023", Budget: 301919, userId: 8 },
    { id: 10, name: "Realbridge", startDate: "3/5/2021", endDate: "10/2/2026", Budget: 505602, userId: 5 }]


const Campaigns = () => {
    const [filteredCampList, setFilteredCampList] = useState([]);
    const [searchCriteria, setSearchCriteria] = useState('');
    const [date, setDate] = useState({})
    const [campaigns, setUpdatedCampaignList] = React.useState(
        []
    );

    const { RangePicker } = DatePicker

    const getTimeInSeconds = (startDate, endDate) => {
        const startTime = new Date(startDate).getTime()
        const endTime = new Date(endDate).getTime()
        return {
            startTime,
            endTime
        }
    }
    const result = campaignsList.filter((item) => {
        const { startTime, endTime } = getTimeInSeconds(item.startDate, item.endDate)
        return startTime < endTime
    })
    console.log("result", result)


    useEffect(() => {
        fetch(("https://jsonplaceholder.typicode.com/users")).then(res => res.json()).then((data) => {
            const campaignsWithUserName = campaignsList.filter((item) => {
                const { startTime, endTime } = getTimeInSeconds(item.startDate, item.endDate)
                return startTime < endTime
            }).map((campaignItem) => {
                const userItem = data.find(
                    (userItem) => userItem.id === campaignItem.userId
                );
                const username = userItem ? userItem.name : '';
                const currentDate = new Date().getTime()
                const startDate = new Date(campaignItem.startDate).getTime()
                const endDate = new Date(campaignItem.endDate).getTime()
                return {
                    ...campaignItem,
                    username,
                    active: currentDate >= startDate && currentDate <= endDate,
                };
            });
            setUpdatedCampaignList(campaignsWithUserName)
        })
    }, [])

    const handleInputChange = (event) => {
        setSearchCriteria(event.target.value);
    };

    const compareDates = (startDate, endDate) => {
        let startTime = new Date(startDate).getTime();
        let endTime = new Date(endDate).getTime();

        return startTime >= date.startDateTime && endTime <= date.endDateTime
    };

    const loadData = () => {
        if (searchCriteria !== '' || Object.entries(date).length) {
            let searchResult = campaigns
            if (searchCriteria !== '') {
                searchResult = searchResult.filter((item) => {
                    const lowerCaseSearchCriteria = searchCriteria.toLocaleLowerCase()
                    return item.name.toLowerCase().search(lowerCaseSearchCriteria) !== -1;
                });
            }
            if (Object.entries(date).length) {
                searchResult = searchResult.filter((item) => {
                    const { startDate, endDate } = item
                    return compareDates(startDate, endDate);
                });
            }
            setFilteredCampList(searchResult);
        }
        else {
            setFilteredCampList(campaigns);
        }
    };

    useEffect(() => {
        console.log("date", date)
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchCriteria, campaigns, date]);

    return (
        <div className="mainContainer">
            <div className='filterSection'>
                <div>
                    <RangePicker
                        onChange={(values) => {
                            console.log(values)
                            if (values) {
                                setDate({
                                    startDateTime: values[0].$d.getTime(),
                                    endDateTime: values[1].$d.getTime()
                                })
                            }
                            else {
                                setDate({})
                            }
                        }}
                    />
                </div>
                <div>
                    <input
                        className='search-campaign'
                        placeholder="search campaign"
                        name="search"
                        value={searchCriteria}
                        onChange={handleInputChange}
                    />
                    <button
                        className='clear-btn'
                        onClick={() => {
                            setSearchCriteria('');
                        }}
                    >
                        Clear
                    </button>
                </div>

            </div>
            <h2>Campaigns</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User Name</th>
                        <th>Campaign Name</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Active</th>
                        <th>Budget</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCampList.map((campaign) => (
                        <tr key={campaign.id}>
                            <td>{campaign.id}</td>
                            <td>{campaign.username}</td>
                            <td>{campaign.name}</td>
                            <td>{campaign.startDate}</td>
                            <td>{campaign.endDate}</td>
                            <td className={campaign.active ? "active-campaign" : "inactive-campaign"}>{campaign.active ? "Active" : "Inactive"}</td>
                            <td>{campaign.Budget}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Campaigns