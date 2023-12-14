/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react';
import Layout from '../components/Layout';
import axios from 'axios'
import { message, Form, Input, Select, Rate, Typography} from 'antd';
import { StarFilled } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../redux/features/alertSlice';
import { useNavigate } from 'react-router-dom';
import Images from '../constants/Image';
import DoctorList from '../components/DoctorList';

const { Option } = Select;

const Homepage = () => {
  
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + totalSlides) % totalSlides);
  };

  const totalSlides = 3;

  useEffect(() => {
    const intervalId = setInterval(() => {
      nextSlide();
    }, 5000); // Change the interval duration as needed (here, it advances every 5 seconds)

    return () => clearInterval(intervalId); // Cleanup function to clear the interval on component unmount
  }, [currentSlide]); // Include currentSlide in the dependency array to avoid potential issues


  const [doctors, setDoctors] = useState([])
  //login user data
  const getUserData = async() => {
    try {
      const res = await axios.get('/api/v1/user/getAllDoctors', {
        headers: {
          Authorization : "Bearer " + localStorage.getItem('token'),
        },
      })
      if (res.data.success) {
        setDoctors(res.data.data)
        console.log('Doctors data retrieved successfully:', res.data.data);
      }
    } catch (error) {
      console.log(error)
      
    }
  }

  const handleSubmit = async (values) => {
      try {
          dispatch(showLoading());
          const res = await axios.post('/api/v1/user/create-feedback', {
              ...values,
              userId: user._id,
          }, {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
              }
          });
          dispatch(hideLoading());

          if (res.data.success) {
              message.success(res.data.message);
              navigate('/user/feedbacks');
          } else {
              message.error(res.data.message);
          }
      } catch (error) {
          dispatch(hideLoading());
          console.error(error);
          message.error('Something went wrong');
      }
  };

  useEffect(() => {
    getUserData()
  }, [])
  
  const testimonialsData = [
    {
      text: "I'm so grateful for the caring team at Your Vets. They always take the time to answer my questions and make my pet feel comfortable during every visit. Thank you for your excellent service!",
      name: "Luisa Marie",
    },

    {
      text: "The staff at Your Vets Animal Clinic are amazing! They treated my pet with such kindness and expertise. I appreciate the personalized attention they provide. Highly recommended!",
      name: "Divine Grace",
    },
     {
      text: "I've been bringing my pet to Your Vets for years, and the level of care is outstanding. The veterinarians are knowledgeable, and the entire staff is friendly and professional. Thank you for taking such good care of my furry friend!",
      name: "Jericho",
    },
  ];


  return (
    <Layout>

  <header className="container-fluid mt-10">
      <div className="row">
        <div className="col-md-12 position-relative p-0">
          <button className="btn btn-secondary position-absolute start-0 top-50 ml-5 translate-middle-y" onClick={prevSlide}>
            <i className="fa-solid fa-angles-left"></i>
          </button>
          <button className="btn btn-secondary position-absolute end-0 top-50 mr-5 translate-middle-y" onClick={nextSlide}>
            <i className="fa-solid fa-angles-right"></i>
          </button>
          <img
            id="dog"
            className="w-100 mb-1 m-0 p-0"
            src={
              currentSlide === 0
                ? Images.carousel1
                : currentSlide === 1
                ? Images.carousel2
                : Images.carousel3
            }
            alt="name"
          />
      <div className="carousel-caption text-center align-items-center justify-content-center position-absolute top-50 start-50 translate-middle">
        {/* Your existing content */}
        <h4 style={{ fontSize: '2.5rem', marginTop: '1rem' }} className="font-bold d-sm-block">Best Pet Services</h4>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '5px' }} className="font-bold d-sm-block">Keep Your Pet Happy</h1>
        <h3 style={{ fontSize: '0.95rem' }} className="text-white d-sm-block">Discover the Best Pet Services to Keep Your Furry Friend Happy and Healthy.</h3>
        {doctors && doctors.map((doctor) => <DoctorList key={doctor._id} doctor={doctor} />)}
      </div>
        </div>
      </div>
    </header>


    {/* <!-- Start About Us --> */} 
        <div class="container5">
        <div class="row py-5">
            <div class="col-lg-7 pb-lg-0 px-3 px-lg-5">
                <h1 class=" mb-4 font-bold text-5xl"><span class="text-primary">About</span> <span class="text-warning">Us</span></h1>
                <p class="mb-4">A dedicated veterinary facility, Your Vets Animal Clinic, is unwavering in its commitment to providing a holistic range of healthcare services for beloved pets. 
                With a focus on delivering not just medical treatments, but also prioritizing preventive care and personalized attention, 
                the clinic strives to create a nurturing environment for animals. The overarching mission of Your Vets is to guarantee the well-being and happiness of pets through the provision of expert veterinary services. 
                This entails a comprehensive approach that extends beyond traditional medical care, emphasizing the importance of a caring and supportive atmosphere for both pets and their owners. 
                Your Vets Animal Clinic is not merely a healthcare provider; it is a compassionate partner in ensuring the optimal health and joy of every cherished animal in its care.</p>
                <ul class="list-inline">
                    <li><h5 className='font-bold'><i class="fa fa-check-double text-secondary mr-3 text-lg"></i>Best In Industry</h5></li>
                    <li><h5 className='font-bold'><i class="fa fa-check-double text-secondary mr-3 text-lg"></i>Emergency Services</h5></li>
                    <li><h5 className='font-bold'><i class="fa fa-check-double text-secondary mr-3 text-lg"></i>Best in taking care of your Pets</h5></li>
                </ul>

            </div>
            <div class="col-lg-5">
                <div class="row px-2">
                    <div class="col-12 p-0">
                        <img class="img-fluid w-100" src={Images.about1} alt=""/>
                    </div>
                    <div class="col-6 p-0">
                        <img class="img-fluid w-100" src={Images.about2} alt=""/>
                    </div>
                    <div class="col-6 p-0">
                        <img class="img-fluid w-100" src={Images.about3} alt=""/>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {/* <!-- Start  --> */}

    {/* <!-- Start Service --> */}
      <div  style={{ backgroundColor: '#E8F4FE'}}>    
      <div class="container-fluid p-0 m-0">
        <div class="px-5 p-0">
          <div class="d-flex flex-column text-center mb-5">
            <h4 class="text-secondary mb-3 mt-4 text-5xl font-bold">Our Services</h4>
            <h1 class="display-4 m-0 font-bold"><span class="text-primary">Premium</span> Pet Services</h1>
          </div>

          <div class="row pb-3">
            <div class="col-md-6 col-lg-4 mb-4">
              <div class="service-card d-flex flex-column text-center bg-gray-300 rounded-lg mb-2 p-3 p-sm-5">
                <h3 class="fa-solid fa-suitcase-medical display-3 font-weight-normal text-secondary mb-3"></h3>
                <h3 class="mb-3">Medication</h3>
                <p>Medication refers to the administration of drugs or Veterinarians substances to treat, alleviate, or prevent diseases, symptoms, or conditions in animals. 
                  Veterinarians may prescribe medications such as antibiotics, pain relievers, or anti-inflammatory drugs.</p>
              </div>
            </div>

            <div class="col-md-6 col-lg-4 mb-4">
              <div class="service-card d-flex flex-column text-center bg-gray-300 rounded-lg mb-2 p-3 p-sm-5">
                <h3 class="fa fa-syringe display-3 font-weight-normal text-secondary mb-3"></h3>
                <h3 class="mb-3">Vaccination</h3>
                <p>Vaccination involves the administration of vaccines to animals to stimulate their immune systems and provide protection against specific infectious diseases.
                  Vaccinations are crucial for preventing the spread of diseases and maintaining the overall health of the animal population.</p>
              </div>
            </div>

            <div class="col-md-6 col-lg-4 mb-4">
              <div class="service-card d-flex flex-column text-center bg-gray-300 rounded-lg mb-2 p-3 p-sm-5">
                <h3 class="fa-solid fa-stethoscope display-3 font-weight-normal text-secondary mb-3"></h3>
                <h3 class="mb-3">Check Up</h3> 
                <p>A check-up, also known as routine examination, is a thorough physical examination of an animal conducted by a veterinarian. 
                  It is performed to assess the overall health of the animal, detect any potential issues early on, and discuss preventive care measures with the pet owner.</p>
              </div>
            </div>
          </div>

          <div class="row pb-3">
            <div class="col-md-6 col-lg-4 mb-4">
              <div class="service-card d-flex flex-column text-center bg-gray-300 rounded-lg mb-2 p-3 p-sm-5">
                <h3 class="fa-solid fa-house-medical display-3 font-weight-normal text-secondary mb-3"></h3>
                <h3 class="mb-3">Out-Patient</h3>
                <p>Outpatient veterinary services cover routine check-ups, vaccinations, and minor treatments for pets, 
                  allowing them to return home on the same day. This approach is efficient for preventive care and addressing non-emergency health concerns, 
                  ensuring timely attention while prioritizing the well-being and comfort of the animals.</p>
              </div>
            </div>

            <div class="col-md-6 col-lg-4 mb-4">
              <div class="service-card d-flex flex-column text-center bg-gray-300 rounded-lg mb-2 p-3 p-sm-5">
                <h3 class="fa-solid fa-flask display-3 font-weight-normal text-secondary mb-3"></h3>
                <h3 class="mb-3">Lab Test</h3>
                <p>Lab tests involve the analysis of samples, such as blood, urine, or tissue, in a laboratory setting. 
                  In veterinary medicine, lab tests are conducted to diagnose diseases, assess organ function, and monitor overall health. 
                  Common veterinary lab tests include blood tests, urinalysis, and imaging studies.</p>
              </div>
            </div>

            <div class="col-md-6 col-lg-4 mb-4">
              <div class="service-card d-flex flex-column text-center bg-gray-300 rounded-lg mb-2 p-3 p-sm-5">
                <h3 class="fa-solid fa-scissors display-3 font-weight-normal text-secondary mb-3"></h3>
                <h3 class="mb-3">Surgery</h3> 
                <p>Surgery in the veterinary context involves the use of operative procedures to treat or correct various medical conditions in animals.
                  Veterinary surgeries can range from routine procedures such as spaying or neutering to more complex surgeries, including tumor removal, orthopedic procedures, and dental surgeries.</p>
              </div>
            </div>
          </div>

          
        </div>
      </div>
      </div> 

    {/* <!-- Services End --> */}
      
    {/* <!-- Features Start --> */}
    <div class="container6">
        <div class="row align-items-center">
            <div class="col-lg-5">
                <img class="img-fluid w-100" src={Images.feature} alt=""/>
            </div>
            <div class="col-lg-7 py-lg-0 px-2 px-lg-3">
                <h4 class="text-secondary mb-3 text-5xl font-bold">Why Choose Us?</h4>
                <h1 class="display-4 mb-4 font-bold"><span class="text-primary">Special Care</span> On Pets</h1>
                <p class="mb-4">At Your Vets, we understand that your pets are cherished members of your family, and that's why we go beyond standard veterinary care. 
                Our commitment is to provide not just medical services, but a special level of care that recognizes the unique bond between you and your furry companions. 
                Our team of dedicated professionals is passionate about ensuring the well-being and happiness of your pets. From routine check-ups to specialized treatments, we approach each case with individualized attention.
                </p>
                <div class="row py-2">
                    <div class="col-6">
                        <div class="d-flex align-items-center mb-4">
                           
                            <h5 class="text-truncate m-0 font-bold">Best In Industry</h5>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="d-flex align-items-center mb-4">
                            
                            <h5 class="text-truncate m-0 font-bold">Emergency Services</h5>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="d-flex align-items-center">
                            
                            <h5 class="text-truncate m-0 font-bold">Special Care</h5>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="d-flex align-items-center">
                            
                            <h5 class="text-truncate m-0 font-bold mb-2">Best Veterinary Practices</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>  
    </div>

    {/* <!-- Features End -->         */}


    {/* <!-- Feedback Start --> */}

          <section  style={{ backgroundColor: '#E8F4FE'}}>
          
          <div className="px-6 py-10 mx-auto">
            <Typography.Title level={1} className="text-center text-2xl capitalize mt-5 text-primary mb-3">
              What our clients say
            </Typography.Title>

            <Typography.Paragraph className="mx-auto mt-6 text-center text-gray-500 dark:text-gray-200 text-lg">
            What our clients say matters to us because it shapes the heart of Your Vets Animal Clinic. We value the voices of those who entrust us with the care of their beloved pets, and their feedback guides our commitment to excellence. 
            Every testimonial is a testament to the trust placed in our team, emphasizing the importance of open communication and collaboration in your pet's healthcare journey. Your experiences shape our practice, and we are dedicated to continuously listening and learning from you.
            Your Vets is not just a clinic; it's a community of pet lovers working together to ensure the best for our furry friends. Your words matter, and they inspire us to continually strive for the highest standards in veterinary care.
            </Typography.Paragraph>

            <section className="grid grid-cols-3 gap-3 mt-8">
              {testimonialsData.map((testimonial, index) => (
                <div key={index} className="testimonial-card p-8 border rounded-lg bg-white">
                  <Typography.Paragraph className="leading-loose text-gray-500 dark:text-gray-400">
                    {testimonial.text}
                  </Typography.Paragraph>
                  <div className="flex items-center mt-8">
                    <div className="mx-2">
                      <Typography.Title level={4} className="font-semibold text-gray-800 dark:text-white">
                        {testimonial.name}
                      </Typography.Title>
                      <Rate allowHalf defaultValue={5} disabled />
                    </div>
                  </div>
                </div>
              ))}
            </section>
          </div>
              
     
      
            <h2 className='text-center text-4xl font-bold mt-2'><span class='text-secondary'>Send us</span> <span class='text-warning'>Feedback</span></h2>
            <p className="mt-3 mb-4 text-center text-2xl text-black">
              Your feedback shapes our care!
              Share thoughts on check-ups, meds, vaccinations. <br />
              Help us enhance your vet services!
            </p>
            <div className='flex justify-center'>
          <div className='flex w-full max-w-2xl p-5 mx-auto mb-5 rounded-2xl form-container' style={{ backgroundColor: '#fff', }}>
            <Form form={form} layout="vertical" onFinish={handleSubmit} className="w-full feedback-form">
              <Form.Item label="Category" name="category" required rules={[{ required: true }]} className="form-item">
                <Select placeholder="Select a category">
                  <Option value="Vaccination">Vaccination</Option>
                  <Option value="Medication">Medication</Option>
                  <Option value="Check-up">Check-up</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Feedback" name="feedback" required rules={[{ required: true }]} className="form-item">
                <Input.TextArea rows={4} placeholder="Enter your feedback here" />
              </Form.Item>

              <Form.Item
                label="Ratings"
                name="ratings"
                required
                rules={[
                  { required: true, message: 'Please enter ratings' },
                  {
                    validator: async (_, value) => {
                      if (value >= 1 && value <= 5) {
                        return Promise.resolve();
                      }
                      return Promise.reject('Ratings must be between 1 and 5');
                    },
                  },
                ]}
                className="form-item">
                <Rate
                  allowHalf
                  defaultValue={0}
                  character={<StarFilled style={{ backgroundcolor: 'white' }} />}
                />
              </Form.Item>

              <div className='flex justify-center'>
                <button style={{ backgroundColor: '#4a1e8a', color: '#fff' }} className='py-2 form-btn rounded-lg' type="submit">
                  Submit Feedback 
                </button>
              </div>
            </Form>
          </div>
        </div>
      </section>
{/* <!-- Feedback End --> */}



<footer class="footer-distributed">

			<div class="footer-left">

      <div className="mr-96 ">
          <img src={Images.Logo1} alt="Your Vets Animal Clinic Logo" className="logo-image1" />
      </div>

				<p class="footer-company-name">Your Vets Animal Clinic © 2016</p>
			</div>

			<div class="footer-center">

				<div>
					<i class="fa fa-map-marker"></i>
					<p><span>2009 Gerardo Tuazon St, Sampaloc, Manila,</span> 1008 Metro Manila</p>
				</div>

				<div>
					<i class="fa fa-phone"></i>
					<p>+63 917 424 5200
          </p>
				</div>

				<div>
					<i class="fa fa-envelope"></i>
					<p><a href="yourvetsanimalclinic@gmail.com">yourvetsanimalclinic@gmail.com</a></p>
				</div>

			</div>

			<div class="footer-right">

				<p class="footer-company-about">
					<span>About the company</span>
					A veterinary facility committed to offering comprehensive healthcare services for pets, providing medical treatments, preventive care,
           and personalized attention in a caring environment. The clinic's goal is to ensure the well-being and happiness of animals through professional veterinary services.
				</p>

				<div class="footer-icons">

					<a href="#"><i class="fa-brands fa-facebook"></i></a>
					<a href="#"><i class="fa-brands fa-viber"></i></a>
					<a href="#"><i class="fa-brands fa-linkedin"></i></a>
					<a href="#"><i class="fa-brands fa-github"></i></a>

				</div>

			</div>

		</footer>
      
      <div className='d-flex justify-content-end'>
        <a href="#" class="btn btn-lg btn-secondary back-to-top"><i class="fa fa-angle-double-up"></i></a>
      </div> 

    </Layout>
    
  );
};

export default Homepage;