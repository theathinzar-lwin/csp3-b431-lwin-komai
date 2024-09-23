import Banner from '../components/Banner';
import FeaturedProducts from '../components/FeaturedProducts';

export default function Home() {
    const data = {
        title: "The Zuitt Shop",
        content: "Products for everyone, everywhere",
        destination: "/products",
        buttonLabel: "Browse Products" 
    };

    return (
        <>
            <Banner data={data} />
            <FeaturedProducts />
        </>
    );
}
