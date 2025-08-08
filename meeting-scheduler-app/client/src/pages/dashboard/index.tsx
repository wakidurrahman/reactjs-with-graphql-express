import BaseTemplate from '@/components/templates/base-templates';
import { useAuthContext } from '@/context/AuthContext';
import {
  GET_ME,
  GET_MEETINGS,
  type MeQueryData,
  type MeetingsQueryData,
} from '@/graphql/queries';
import { useQuery } from '@apollo/client';
import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard(): JSX.Element {
  const { logout } = useAuthContext();
  const { data: meData } = useQuery<MeQueryData>(GET_ME);
  const { data: meetingsData, loading } =
    useQuery<MeetingsQueryData>(GET_MEETINGS);

  return (
    <BaseTemplate>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Welcome, {meData?.me?.name || 'User'}</h2>
        <button className="btn btn-outline-secondary" onClick={logout}>
          Logout
        </button>
      </div>
      <div className="d-flex justify-content-end mb-2">
        <Link className="btn btn-sm btn-primary" to="/meetings/new">
          + New meeting
        </Link>
      </div>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Your meetings</h5>
          {loading && <p>Loading...</p>}
          {!loading && (
            <ul className="list-group list-group-flush">
              {(
                (meetingsData?.meetings ?? []) as MeetingsQueryData['meetings']
              ).map((m) => (
                <li key={m.id} className="list-group-item">
                  <strong>{m.title}</strong>
                  <div className="small text-muted">
                    {new Date(m.startTime).toLocaleString()} -{' '}
                    {new Date(m.endTime).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </BaseTemplate>
  );
}
