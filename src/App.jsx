import { useEffect, useState } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          'https://checkinn.co/api/v1/int/requests'
        );

        setData(data.requests);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const uniqueHotels = [];

  const filterData = () => {
    for (let i = 0; i < data.length; i++) {
      const hotelName = data[i].hotel.name;

      const isIndex = uniqueHotels.findIndex(
        (hotel) => hotel.name === hotelName
      );

      if (isIndex === -1) {
        uniqueHotels.push({ name: hotelName, requestCount: 1 });
      } else {
        uniqueHotels[isIndex].requestCount += 1;
      }
    }
  };

  filterData();

  const series = [
    {
      name: 'Requests',
      data: uniqueHotels.map((hotel) => hotel.requestCount),
    },
  ];

  const options = {
    chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'straight',
    },
    title: {
      text: 'Requests per Hotel',
      align: 'center',
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: uniqueHotels.map((hotel) => hotel.name),
    },
  };

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={350}
        />
      </div>
    </div>
  );
}

export default App;
