import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export default function FriendDetails() {
  const params = useParams();
  const [friendDetails, setFriendsDetails] = useState();

  const fetchFriendsDetails = async () => {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/friends-details`;
    userId = params.userId;

    try {
      const response = axios.post(url, userId, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        setFriendsDetails(data);
        console.log(data)
      } else {
        toast.error("User not created. Please try again.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchFriendsDetails();
  }, []);

  return (
    <>
      <div>Hi</div>
    </>
  );
}
