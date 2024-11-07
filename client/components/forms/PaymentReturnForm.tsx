import { useRouter } from 'next/router';
import { useEffect } from 'react';
import axios from 'axios';
import { routes } from '@utils/constants';
const PaymenReturnForm: IFirstErrorComponent<IFirstErrorComponentProps> = () => {
    const router = useRouter();

    useEffect(() => {
        const handlePaymentSuccess = async () => {
            const { token } = router.query;

            try {
                const response = await axios.get(`http://localhost:4500/payment-return?token=${token}`);

                if (response.data.status) {
                    // Xử lý kết quả thanh toán thành công
                    console.log(response.data.status);
                    alert('Payment successful');
                    router.push('/payment-success');
                } else {
                    // Xử lý lỗi
                    router.push('/payment-success');
                }
            } catch (error) {
                console.error('Error handling payment success:', error);
                router.push(routes.CLIENT.PAYMENT_FAIL_PAGE);
            }
        };

        if (router.query.token) {
            handlePaymentSuccess();
        }
    }, [router]);
    return (
        <div className="components__firsterror">
            <div className="components__firsterror-form p-4 ">
                <h1 className="components__firsterror-firsttext text-center">Waiting.......</h1>
            </div>
        </div>
    );
};

export default PaymenReturnForm;
