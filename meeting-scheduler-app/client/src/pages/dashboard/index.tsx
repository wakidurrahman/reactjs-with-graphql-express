import Button from '@/components/atoms/button';
import Heading from '@/components/atoms/heading';
import Spinner from '@/components/atoms/spinner';
import BaseTemplate from '@/components/templates/base-templates';
import { useAuthContext } from '@/context/AuthContext';
import {
  GET_ME,
  GET_MEETINGS,
  type MeQueryData,
  type MeetingsQueryData,
} from '@/graphql/queries';
import { formatJST } from '@/utils/date';
import { useQuery } from '@apollo/client';
import React from 'react';

export default function Dashboard(): JSX.Element {
  const { logout } = useAuthContext();
  const { data: meData } = useQuery<MeQueryData>(GET_ME);
  const { data: meetingsData, loading } =
    useQuery<MeetingsQueryData>(GET_MEETINGS);
  console.log('meetingsData', meetingsData);
  console.log('loading', loading);
  console.log('meData', new Date(1754828400000).toLocaleString());

  return (
    <BaseTemplate>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Heading level={2}>Welcome, {meData?.me?.name || 'User'}</Heading>
          <Button variant="secondary" outline onClick={logout}>
            Logout
          </Button>
        </div>
        <div className="d-flex justify-content-end mb-2">
          <Button variant="primary" size="sm" href="/meetings/new">
            + New meeting
          </Button>
        </div>
        <div className="card">
          <div className="card-body">
            <Heading level={5}>Your meetings</Heading>
            {loading && <Spinner />}
            {!loading && (
              <ul className="list-group list-group-flush">
                {(
                  (meetingsData?.meetings ??
                    []) as MeetingsQueryData['meetings']
                ).map((m) => (
                  <li key={m.id} className="list-group-item">
                    <strong>{m.title}</strong>
                    <div className="small text-muted">
                      {formatJST(m.startTime, 'yyyy-MM-dd HH:mm')} -{' '}
                      {formatJST(m.endTime, 'yyyy-MM-dd HH:mm')}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </BaseTemplate>
  );
}
