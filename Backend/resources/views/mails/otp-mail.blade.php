<html>
<head>
</head>
<body style="background-color: #fafafa; display: flex; justify-content: center; align-items: center; margin: 0; min-height: 100vh; font-family: 'Open Sans', sans-serif;">
  <div style="width: 40vw; border-radius: 40px; overflow: hidden; box-shadow: 0px 7px 22px 0px rgba(0, 0, 0, .1);">
    <div style="background-color: green; width: 100%; height: 60px;">
      <h1 style="font-size: 23px; font-family: 'Open Sans', sans-serif; height: 60px; line-height: 60px; margin: 0; text-align: center; color: white;">Your Verification Link</h1>
    </div>
    <div style="width: 100%; height: 300px; display: flex; flex-direction: column; justify-content: space-around; align-items: center; flex-wrap: wrap; background-color: #fff; padding: 15px;">
      <p style="padding-right:5px; padding-left:5px; font-size: 20px; text-align: center; color: #343434; margin-top: 0;">Click the button below to verify your account</p>
      <table border="0" cellspacing="0" cellpadding="0" style="box-sizing: border-box; border-collapse: separate !important; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto; padding-bottom: 15px; margin-left: auto; margin-right: auto;">
        <tr>
          <td align="center" valign="top" style="box-sizing: border-box; vertical-align: top; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 5px; text-align: center; background: #1271db;">
            @if ($data['is_invite'] === false)
            <a href="{{ config('app.frontendUrl').'/verify-account?code='. $data['otp'].'&ref='. \Crypt::encrypt($data['ref']) }}" style="box-sizing: border-box; color: #ffffff; text-decoration: none; border-radius: 5px; cursor: pointer; display: inline-block; font-size: 14px; font-weight: bold; text-transform: capitalize; background: #1271db; margin: 0; padding: 12px 25px; border: 1px solid #1271db;">Click Here</a>
            {{-- <a href="{{ config('app.frontendUrl').'/verify-account?code='. $data['otp'].'&ref='. \Crypt::encrypt($data['ref']) }}" style="box-sizing: border-box; color: #ffffff; text-decoration: none; border-radius: 5px; cursor: pointer; display: inline-block; font-size: 14px; font-weight: bold; text-transform: capitalize; background: #1271db; margin: 0; padding: 12px 25px; border: 1px solid #1271db;">Click Here</a> --}}
            @endif
            @if ($data['is_invite'] === true)
            <p>{{ $data['otp'] }}</p> 
            @endif
          </td>
        </tr>
      </table>
{{--       
      <div style="display: block; width: 60%; margin: 30px auto; background-color: #ddd; border-radius: 40px; padding: 20px; text-align: center; font-size: 36px; font-family: 'Open Sans', sans-serif; letter-spacing: 10px; box-shadow: 0px 7px 22px 0px rgba(0, 0, 0, .1);">
        <span style="font-size: 36px; font-family: 'Open Sans', sans-serif; letter-spacing: 10px;">{{ $data['otp'] }}</span>
      </div> --}}
      <p style="font-size: 20px; text-align: center; color: #343434; margin-top: 0; font-style: italic; opacity: 0.3; margin-bottom: 0;">Verification link is valid only for 10 minutes</p>
    </div>
    <div style="width: 100%; height: 60px; background-color: #fff;"></div>
  </div>
</body>
</html>
