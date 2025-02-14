"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import moment from "moment";
import CustomLayout from "../layout/layout"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {useRouter} from "next/navigation"
import {RiLoader4Fill} from "react-icons/ri"

const BigCalendar = dynamic(() => import("@/components/calendar/page"), {
  ssr: false,
});

export default function Calendar({session, store, eventss, user, plan}) {

  const router = useRouter();
  const [events, setEvents] = useState(eventss ? eventss : []);
  const [viewerDate, setViewerDate] = useState(new Date());
  const [theEvent, setTheEvent] = useState();
  const [startCampaign, setStartCampaign] = useState();
  const [openPopup, setOpenPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [regenerateLoading, setRegenerateLoading] = useState(false);

  const createCampaign = async (id, campaign) => {
    setLoading(true);

    if (!id || !campaign) {
      setLoading(false);
      return { error: 'All fields are required' };
    }

    if (!session?.user?.id) {
      setLoading(false);
      return { error: 'User not found' };
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/calendar/startcampaign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ id , campaign })
      });
      const data = await response.json();
      router.push(`/create-campaign`);
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      console.error("Error creating campaign:", error);
    }
  };


  const onClickGenerateSchedule = () => {
    async function regenerate() {
      setRegenerateLoading(true);
      let storeID = null;
  if (user.shopifyStoreId !== null && user.shopifyStoreId !== "" && user.shopifyStoreId !== undefined) {
    storeID = user.shopifyStoreId;
  } else {
    storeID = store.id;
  }

      try {
        const response = await fetch(`https://dev.mybranzapi.link/v1/calender_generator`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            "country": "Canada",
            "year": `${new Date().getFullYear()} ${new Date().toLocaleString('default', { month: 'long' })}`,
            "planType": `${plan.planName} ${plan.emails}`,
            "storeId": String(storeID)
          })
        });
        const data = await response.json();
        const calData = Object.values(data)[0];
        setEvents(calData);
        setRegenerateLoading(false);
      } catch (error) {
        setRegenerateLoading(false);
        console.error("Error regenerating schedule:", error);
      }
    }

    regenerate();
  };

  const onClickClearMonth = () => {
    // fetchFn("POST", "", {
    //   how: ACTION_CLEAR_SCHEDULE,
    //   dto: { year, month },
    // }).then((resp) => {
    //   setEvents((arr) => {
    //     const filtered = arr.filter(
    //       (item) =>
    //         !(item.resource.year === year && item.resource.month === month),
    //     );
    //     return filtered;
    //   });
    // });
  };

  const onSelectCalendarEvent = (e) => {
    const findEvent = events.find((event) => event['Strategy Title'] === e.title);
    setStartCampaign(findEvent);
    setOpenPopup(true);
  };


//   [
//     {
//         "Campaign Type": "Pre-Sale Announcement",
//         "Date": "2024-02-05",
//         "Description": "Alert customers about the upcoming Valentine's Day sale.",
//         "Example Content": "Get ready for our Valentine's Day sale starting soon!",
//         "Strategy Title": "Valentine's Day Build-Up",
//         "Type": "Promotional",
//         "start": "2024-09-18T13:21:26.180Z",
//         "end": "2024-09-18T13:21:26.180Z"
//     },
//     {
//         "Campaign Type": "Sale Start",
//         "Date": "2024-02-14",
//         "Description": "Announce the start of the Valentine's Day sale.",
//         "Example Content": "Our Valentine's Day sale is live! Shop now and save 25% on select items.",
//         "Strategy Title": "Valentine's Day Sale Launch",
//         "Type": "Promotional",
//         "start": "2024-09-18T13:21:26.180Z",
//         "end": "2024-09-18T13:21:26.180Z"
//     },
//     {
//         "Campaign Type": "Product Highlight",
//         "Date": "2024-02-19",
//         "Description": "Showcase bestselling products after Valentine's Day.",
//         "Example Content": "Check out our top sellers that your loved ones will adore.",
//         "Strategy Title": "Post-Valentine's Bestsellers",
//         "Type": "Informative",
//         "start": "2024-09-18T13:21:26.180Z",
//         "end": "2024-09-18T13:21:26.180Z"
//     },
//     {
//         "Campaign Type": "Regular Newsletter",
//         "Date": "2024-02-26",
//         "Description": "Summarize the highlights and offers of February.",
//         "Example Content": "February highlights: Bestsellers, customer favorites, and upcoming offers.",
//         "Strategy Title": "February Highlights",
//         "Type": "Informative",
//         "start": "2024-09-18T13:21:26.180Z",
//         "end": "2024-09-18T13:21:26.180Z"
//     }
// ]

  const editedCampaignArray = events?.map((campaign) => {
    const start = moment(campaign.Date).toDate();
    const end = moment(campaign.Date).add(1, "days").toDate();
    const title = campaign["Strategy Title"];
    return {  start, end, title };
  }
  );

  return (
    <CustomLayout>
      <Dialog open={openPopup} onOpenChange={setOpenPopup}>
      {openPopup && <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{startCampaign['Strategy Title']}</DialogTitle>
          <DialogDescription>
            <p className="text-base text-left"><span className=" font-bold">Subject: </span>{startCampaign['Example Content']}</p>
            <p className="text-base text-left"><span className=" font-bold">Campaign Type: </span>{startCampaign['Campaign Type']}</p>
            <p className="text-base text-left"><span className=" font-bold">Description: </span>{startCampaign['Description']}</p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="submit" onClick={() => createCampaign(session?.user?.id, startCampaign)} className="bg-black text-white flex items-center justify-center gap-2">Create Campaign <RiLoader4Fill fontSize={20}  className={`spinner ${loading ? 'block' : 'hidden'}`} /></Button>
        </DialogFooter>
          <p className="text-xs mt-2 mb-0 text-center">This data can be changed while editing in the next step.</p>
      </DialogContent>}
    </Dialog>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-11 p-5">
            {!user.shopifyStoreId && <div className="pb-4 flex flex-row items-center justify-center sm:justify-between flex-wrap gap-4">
              <button
                variant="primary"
                onClick={onClickGenerateSchedule}
                className="flex items-center justify-center gap-2 bg-black text-white py-2 px-4 rounded hover:bg-[#f2324fab]"
                // disabled={loading}
              >
                Regenerate schedule for month <RiLoader4Fill className={`text-[#000] ${regenerateLoading ? 'animate-spin' : 'hidden'} mr-2`} />
              </button>
              <button
              
                variant="primary"
                onClick={onClickClearMonth}
                className="flex items-center justify-center gap-2 bg-black text-white py-2 px-4 rounded hover:bg-[#f2324fab]"
                // disabled={loading}
              >
                Clear schedule for month
              </button>
            </div>}
            <BigCalendar
              events={editedCampaignArray}
              viewerDate={viewerDate}
              onSelectCalendarEvent={onSelectCalendarEvent}
              setViewerDate={setViewerDate}
            />
          </div>
        </div>
      </div>
      </CustomLayout>
  );
}
