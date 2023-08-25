import { fireEvent, render, waitFor } from '@testing-library/react';

import { AuthProvider } from '@shopby/react-components';

describe('SignIn Btn Test', () => {
  test('msw 테스트용: 아이디와 비밀번호를 모두 입력해서 로그인 버튼을 누르면 SignInButton 내부 문구는 로그아웃으로 바뀌어야 합니다.', async () => {
    const { SignInButton } = require('@shopby/react-components');
    const { getByText, getByTestId } = render(
      <AuthProvider>
        <SignInButton />
      </AuthProvider>
    );
    expect(getByText('로그인')).toBeInTheDocument();
    fireEvent.change(getByTestId('member-id'), { target: { value: '아이디아무거나' } });
    fireEvent.change(getByTestId('password'), { target: { value: '비밀번호아무거나' } });
    fireEvent.click(getByTestId('sign-in-btn'));

    await waitFor(() => {
      expect(getByTestId('sign-in-btn')).toHaveTextContent('로그아웃');
    });
  });
});
