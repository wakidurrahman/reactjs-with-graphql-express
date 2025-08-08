import BaseTemplate from '@/components/templates/base-templates';
import {
  CREATE_MEETING,
  type CreateMeetingMutationData,
  type CreateMeetingMutationVariables,
} from '@/graphql/mutations';
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  startTime: z.string().min(1, 'Start time is required'), // datetime-local string
  endTime: z.string().min(1, 'End time is required'), // datetime-local string
  attendees: z.string().optional(), // comma-separated IDs
});

type FormValues = z.infer<typeof schema>;

export default function CreateMeeting(): JSX.Element {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const [createMeeting, { loading, error }] = useMutation<
    CreateMeetingMutationData,
    CreateMeetingMutationVariables
  >(CREATE_MEETING, {
    onCompleted: () => navigate('/'),
  });

  const toIsoString = (value: string): string => {
    // Convert from input type="datetime-local" (local time) to ISO string
    // If value already ISO, new Date handles it
    const date = new Date(value);
    return date.toISOString();
  };

  const onSubmit = (values: FormValues) => {
    const attendeeIds = (values.attendees || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    return createMeeting({
      variables: {
        input: {
          title: values.title,
          description: values.description ?? null,
          startTime: toIsoString(values.startTime),
          endTime: toIsoString(values.endTime),
          attendeeIds,
        },
      },
    });
  };

  return (
    <BaseTemplate>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <h2 className="mb-3">Create Meeting</h2>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input className="form-control" {...register('title')} />
                {errors.title && (
                  <div className="text-danger small">
                    {errors.title.message}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  {...register('description')}
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Start time</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    {...register('startTime')}
                  />
                  {errors.startTime && (
                    <div className="text-danger small">
                      {errors.startTime.message}
                    </div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">End time</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    {...register('endTime')}
                  />
                  {errors.endTime && (
                    <div className="text-danger small">
                      {errors.endTime.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Attendee IDs (comma-separated)
                </label>
                <input className="form-control" {...register('attendees')} />
              </div>

              {error && (
                <div className="alert alert-danger">{error.message}</div>
              )}

              <div className="d-flex gap-2">
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={loading || isSubmitting}
                >
                  Create
                </button>
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </BaseTemplate>
  );
}
