import BaseTemplate from '@/components/templates/base-templates';
import { useAuthContext } from '@/context/AuthContext';
import { LOGIN, type LoginMutationData } from '@/graphql/mutations';
import type { UserLoginInput } from '@/types/user';
import { useMutation } from '@apollo/client';
import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

export default function Login(): JSX.Element {
  const navigate = useNavigate();
  const { login: setAuth } = useAuthContext();

  const schema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    criteriaMode: 'all',
    shouldFocusError: true,
  });
  const [loginMutation, { loading, error }] = useMutation<
    LoginMutationData,
    UserLoginInput
  >(LOGIN, {
    onCompleted: (data) => {
      const { token, user } = data.login;
      setAuth(token, user);
      navigate('/');
    },
  });

  const onSubmit = (values: FormValues) => {
    loginMutation({ variables: values });
  };

  return (
    <BaseTemplate>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <h2 className="mb-3">Login</h2>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  {...register('email')}
                />
                {errors.email && (
                  <div className="text-danger small">
                    {errors.email.message}
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  {...register('password')}
                />
                {errors.password && (
                  <div className="text-danger small">
                    {errors.password.message}
                  </div>
                )}
              </div>
              {error && (
                <div className="alert alert-danger">{error.message}</div>
              )}
              <button
                className="btn btn-primary"
                type="submit"
                disabled={loading || isSubmitting}
              >
                Login
              </button>
            </form>
            {process.env.NODE_ENV !== 'production' && (
              <DevTool control={control} />
            )}
          </div>
        </div>
      </div>
    </BaseTemplate>
  );
}
