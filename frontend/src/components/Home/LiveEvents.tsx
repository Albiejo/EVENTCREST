import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Card,
  CardBody,
} from '@material-tailwind/react';
import { axiosInstance } from '../../Api/axiosinstance';
import { Link } from 'react-router-dom';

function Icon({ open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${open ? 'rotate-180' : ''} h-5 w-5 transition-transform`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

interface Live {
  _id: string;
  url: string;
}

const LiveEvents = () => {
  const [live, setLive] = useState<Live[]>([]);
  const [alwaysOpen, setAlwaysOpen] = React.useState(true);
  const handleAlwaysOpen = () => setAlwaysOpen((cur) => !cur);

  useEffect(() => {
    axiosInstance
      .get('/get-live')
      .then((response) => {
        console.log(response.data.live);
        const filteredLive = response.data.live.filter((event) => !event.finished);
        setLive(filteredLive);
      })
      .catch((error) => {
        console.log('here', error);
      });
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        width: '70%',
        margin: 'auto',
      }}
    >
      <Accordion
        open={alwaysOpen}
        icon={<Icon open={handleAlwaysOpen} />}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <AccordionHeader
          style={{ fontFamily: 'playfair', fontSize: '18px' }}
          onClick={handleAlwaysOpen}
          className="text-center" 
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
       
               Experience the Buzz of Live Events Directly from Your Screen
       
        </AccordionHeader>

        <AccordionBody>
          {live?.map((data) => {
            return (
              <Card
                className="w-full h-15 shadow-lg"
                key={data._id}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <CardBody
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <Link to={data.url} className="text-blue-300">
                    {data.url}
                  </Link>
                </CardBody>
                <svg className="absolute top-7 right-8" width="20" height="20">
                  <circle cx="15" cy="5" r="5" fill="red" />
                </svg>
              </Card>
            );
          })}
        </AccordionBody>
      </Accordion>
    </div>
  );
};

export default LiveEvents;