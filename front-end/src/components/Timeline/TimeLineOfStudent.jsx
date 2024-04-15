import React from 'react'
import { Eventcalendar, getJson, setOptions, Toast } from '@mobiscroll/react';
import { useCallback, useMemo, useState } from 'react';
import "@mobiscroll/react/dist/css/mobiscroll.min.css";
import './TimeLineOfStudent.scss'

setOptions({
  theme: 'ios',
  themeVariant: 'light'
});

function TimeLineOfStudent() {
  const [isToastOpen, setToastOpen] = useState(false);
  const [toastText, setToastText] = useState();
  const [toastContext, setToastContext] = useState();

  const myView = useMemo(
    () => ({
      timeline: {
        type: 'month',
      },
    }),
    [],
  );

  const firstEvents = useMemo(
    () => [
      {
        start: '2024-04-02T00:00',
        end: '2024-04-05T00:00',
        title: 'Event 1',
        color: '#166f6f',
        resource: 1,
      },
      {
        start: '2024-04-15T00:00',
        end: '2024-04-19T00:00',
        title: 'Event 2',
        color: '#e20000',
        resource: 1,
      },
      {
        start: '2024-04-10T00:00',
        end: '2024-04-14T00:00',
        title: 'Event 3',
        color: '#1dab2f',
        resource: 2,
      },
      {
        start: '2024-04-20T00:00',
        end: '2024-04-23T00:00',
        title: 'Event 4',
        color: '#e25dd2',
        resource: 2,
      },
      {
        start: '2024-04-03T00:00',
        end: '2024-04-10T00:00',
        title: 'Event 5',
        color: '#4418d2',
        resource: 3,
      },
      {
        start: '2024-04-16T00:00',
        end: '2024-04-19T00:00',
        title: 'Event 6',
        color: '#4981d6',
        resource: 3,
      },
      {
        start: '2024-04-08T00:00',
        end: '2024-04-12T00:00',
        title: 'Event 7',
        color: '#6e7f29',
        resource: 4,
      },
      {
        start: '2024-04-22T00:00',
        end: '2024-04-28T00:00',
        title: 'Event 8',
        color: '#8b8b00',
        resource: 4,
      },
      {
        start: '2024-04-02T00:00',
        end: '2024-04-07T00:00',
        title: 'Event 9',
        color: '#a32f00',
        resource: 5,
      },
      {
        start: '2024-04-18T00:00',
        end: '2024-04-23T00:00',
        title: 'Event 10',
        color: '#152d2b',
        resource: 5,
      },
    ],
    [],
  );

  const firstResources = useMemo(
    () => [
      {
        id: 1,
        name: 'Resource A',
      },
      {
        id: 2,
        name: 'Resource B',
      },
      {
        id: 3,
        name: 'Resource C',
      },
      {
        id: 4,
        name: 'Resource D',
      },
      {
        id: 5,
        name: 'Resource E',
      },
    ],
    [],
  );

  const secondEvents = useMemo(
    () => [
      {
        start: '2024-04-05T00:00',
        end: '2024-04-09T00:00',
        title: 'Event 1',
        color: '#4418d2',
        resource: 1,
      },
      {
        start: '2024-04-16T00:00',
        end: '2024-04-20T00:00',
        title: 'Event 2',
        color: '#8b1a1a',
        resource: 1,
      },
      {
        start: '2024-04-08T00:00',
        end: '2024-04-11T00:00',
        title: 'Event 3',
        color: '#e7b300',
        resource: 2,
      },
      {
        start: '2024-04-22T00:00',
        end: '2024-04-25T00:00',
        title: 'Event 4',
        color: '#a32f00',
        resource: 2,
      },
      {
        start: '2024-04-12T00:00',
        end: '2024-04-17T00:00',
        title: 'Event 5',
        color: '#21a833',
        resource: 3,
      },
      {
        start: '2024-04-23T00:00',
        end: '2024-04-29T00:00',
        title: 'Event 6',
        color: '#a917bb',
        resource: 3,
      },
      {
        start: '2024-04-04T00:00',
        end: '2024-04-10T00:00',
        title: 'Event 7',
        color: '#e20000',
        resource: 4,
      },
      {
        start: '2024-04-18T00:00',
        end: '2024-04-25T00:00',
        title: 'Event 8',
        color: '#4981d6',
        resource: 4,
      },
      {
        start: '2024-04-07T00:00',
        end: '2024-04-12T00:00',
        title: 'Event 9',
        color: '#166f6f',
        resource: 5,
      },
      {
        start: '2024-04-20T00:00',
        end: '2024-04-27T00:00',
        title: 'Event 10',
        color: '#d6d145',
        resource: 5,
      },
    ],
    [],
  );

  const secondResources = useMemo(
    () => [
      {
        id: 1,
        name: 'Resource A',
      },
      {
        id: 2,
        name: 'Resource B',
      },
      {
        id: 3,
        name: 'Resource C',
      },
      {
        id: 4,
        name: 'Resource D',
      },
      {
        id: 5,
        name: 'Resource E',
      },
    ],
    [],
  );

  const handleCloseToast = useCallback(() => {
    setToastOpen(false);
  }, []);

  const handleFirstCalEventCreated = useCallback((args) => {
    if (args.action === 'externalDrop') {
      setToastText('Event dropped to Calendar 1');
      setToastContext('.md-drag-drop-first-calendar');
      setToastOpen(true);
    }
  }, []);

  const handleSecondCalEventCreated = useCallback((args) => {
    if (args.action === 'externalDrop') {
      setToastText('Event dropped to Calendar 2');
      setToastContext('.md-drag-drop-second-calendar');
      setToastOpen(true);
    }
  }, []);

  return (
    <div className="md-drag-drop-calendar">
      <div className="mbsc-form-group-title">Calendar 1</div>
      <Eventcalendar
        view={myView}
        data={firstEvents}
        resources={firstResources}
        height={420}
        dragToMove={true}
        eventDelete={true}
        externalDrag={true}
        externalDrop={true}
        onEventCreated={handleFirstCalEventCreated}
        className="md-drag-drop-first-calendar"
      />

      <Toast message={toastText} context={toastContext} isOpen={isToastOpen} onClose={handleCloseToast} />
    </div>
  );
}

export default TimeLineOfStudent