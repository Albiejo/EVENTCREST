
import { Card, CardBody, Typography } from '@material-tailwind/react';
import VendorFilters from '../components/Home/VendorFilter';
import VendorSort from '../components/Home/VendorSort';
import Footer from '../components/Home/Footer';
import { Suspense, lazy, useEffect, useState } from 'react';
import { axiosInstance } from '../api/axiosinstance';
import LoadingSpinner from '../components/LoadingSpinner';
//lazy loading here for vendor listing
const VendorCard = lazy(() => import('../components/Home/VendorListingCard'));


interface Vendors {
  _id: string;
  name: string;
  email: string;
  phone: string;
  city:string;
  isActive: boolean;
  totalBooking:number;
  coverpicUrl:string;
}


const VendorsListing = () => {
  const [vendors,setVendors]=useState<Vendors[]>([])

  useEffect(()=>{
      axiosInstance
    .get('/getvendors',{withCredentials:true})
    .then((response) => {
      console.log("vendor data",response.data)
      setVendors(response.data);
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
    });
  },[])
  
  return (

<>
<div className="relative min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/imgs/church.jpg')" }}>
  <div className="absolute inset-0 " />
  <div className="max-w-md mx-auto">
    <Card className="mt-6 bg-gray-200" placeholder={undefined}>
      <CardBody  placeholder={undefined}>
        <Typography variant="h5" color="blue-gray" className="mb-2"  placeholder={undefined}>
          Find Vendors
        </Typography>
        <Typography  placeholder={undefined}>
          Discover the perfect vendors for your perfect day. Start your search now!
        </Typography>
      </CardBody>
    </Card>
  </div>
</div>

<section className="mt-8 mb-20 px-4">    
        <div className="flex justify-between mb-6 ">
          <div>
            <h3 className="text-lg font-semibold">Found {vendors.length} Vendors</h3>
          </div>
          <div className="flex items-center space-x-4">
            <VendorSort />
          </div>
        </div>

      <div className="flex flex-wrap justify-center md:justify-between ">
      <div className="w-full md:w-1/6 mb-6 md:mb-0 flex-shrink-0 ">
          <h3 className="mt-4 mb-2 text-lg font-semibold">Filter By</h3>
          <VendorFilters />
      </div>
      <div className="flex flex-wrap justify-center md:justify-start w-full md:w-3/4 flex-grow">
          <Suspense fallback={<LoadingSpinner/>}>
            {vendors.map((vendor, index) => (
              <div key={index} className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/4 p-4">
                <VendorCard {...vendor} />
              </div>
            ))}
          </Suspense>
      </div>
      </div>
</section>




<div className="bg-white">
  <Footer />
</div>
</>
  );
};

export default VendorsListing;