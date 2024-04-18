import React from 'react';
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Card,
  Checkbox,
  List,
  ListItem,
  ListItemPrefix,
  Typography,
} from '@material-tailwind/react';

interface IconProps {
  id: number;
  open: number;
}

function Icon({ id, open }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${id === open ? 'rotate-180' : ''} h-5 w-5 transition-transform`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

const VendorFilters = ({vendorTypeData , onCategorySelect }) => {


  const [open, setOpen] = React.useState(0);

  const handleOpen = (value: React.SetStateAction<number>) =>
    setOpen(open === value ? 0 : value);

  return (
    <>
      <Accordion
        open={open === 1}
        icon={<Icon id={1} open={open} />}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
        className='w-50'
      >
        <AccordionHeader
          onClick={() => handleOpen(1)}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          className="text-md md:text-md" 
        >
          Category
        </AccordionHeader>
        <AccordionBody>
        <Card  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className='border-4 border-gray-300'>
      <List  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
    
    
    
      {vendorTypeData.map((vendorType, index) => (
                <ListItem key={index} className="p-0"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onClick={() => onCategorySelect(vendorType._id)}>
                  <label
                    htmlFor={`vertical-list-react-${index}`}
                    className="flex w-full cursor-pointer items-center px-3 py-2"
                  >
                    <ListItemPrefix className="mr-3"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      <Checkbox
                        id={`vertical-list-react-${index}`}
                        ripple={false}
                        className="hover:before:opacity-0"
                        containerProps={{
                          className: "p-0",
                        }}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                        crossOrigin={undefined}              
                      />
                    </ListItemPrefix>
                    <Typography color="blue-gray" className="font-medium"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      {vendorType.type}
                    </Typography>
                  </label>
                </ListItem>
              ))}

      
      </List>
    </Card>
        </AccordionBody>
      </Accordion>
    
     
    </>
  );
};

export default VendorFilters;