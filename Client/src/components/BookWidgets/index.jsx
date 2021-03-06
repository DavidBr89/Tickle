import React, {Component} from 'react';
import PropTypes from 'prop-types';
// import styles from './BookWidget.css';

class BookWidget extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };

  componentDidMount(prevProps, prevState) {
    document.widgetLaunchForm.submit();
  }

  render() {
    return (
      <div>
        <form
          action="https://www.bookwidgets.com/play/AF2NPK?teacher_id=6632197966528512"
          method="POST"
          encType="application/x-www-form-urlencoded"
          target="widgetFrame"
          name="widgetLaunchForm">
          <input
            type="hidden"
            name="lti_message_type"
            value="basic-lti-launch-request"
          />
          <input type="hidden" name="lti_version" value="LTI-1p0" />
          <input type="hidden" name="user_id" value="oksaklsakjdaskljjkdsa" />
          <input type="hidden" name="roles" value="Student" />
          <input
            type="hidden"
            name="lis_person_contact_email_primary"
            value="jmaushag@gmail.com"
          />
          <input type="hidden" name="lis_person_name_given" value="John" />
          <input type="hidden" name="lis_person_name_family" value="Doe" />
          <input
            type="hidden"
            name="tool_consumer_info_version"
            value="1.2.3"
          />
          <input
            type="hidden"
            name="tool_consumer_info_product_family_code"
            value="my-lms"
          />
          <input
            type="hidden"
            name="tool_consumer_instance_name"
            value="my-lms-instance"
          />
          <input
            type="hidden"
            name="tool_consumer_instance_description"
            value="My LMS Instance"
          />
          <input
            type="hidden"
            name="tool_consumer_instance_url"
            value="https://my-lms-instance.com"
          />
          <input type="hidden" name="context_id" value="2" />
          <input type="hidden" name="context_title" value="Geography 101" />
          <input type="hidden" name="context_label" value="geography-101" />
          <input
            type="hidden"
            name="lis_result_sourcedid"
            value="3873872987329873264783687634"
          />
          <input
            type="hidden"
            name="lis_outcome_service_url"
            value="https://my-lms-instance.com/results"
          />
          <input type="hidden" name="launch_presentation_locale" value="en" />
          <input
            type="hidden"
            name="oauth_consumer_key"
            value="TVBLxw9tlXj8rWpNVyxZThNIo20tq8"
          />
          <input
            type="hidden"
            name="oauth_signature_method"
            value="HMAC-SHA1"
          />
          <input type="hidden" name="oauth_timestamp" value="1544605249" />
          <input
            type="hidden"
            name="oauth_nonce"
            value="897324879437988794378943879438974389734"
          />
          <input type="hidden" name="oauth_version" value="1.0" />
          <input
            type="hidden"
            name="oauth_signature"
            value="
NDllYjUxODNiYmVhZjk3ODhmMjgxMzhiOWI2MjNjN2VmYmRjMzdiNA=="
          />
          <input type="submit" value="Press to launch widget" />
        </form>
        <iframe
          src="https://www.bookwidgets.com/lti/play/AF2NPK?teacher_id=6632197966528512
"
          width="1024"
          height="768"
          name="widgetFrame"
        />
      </div>
    );
  }
}

export default BookWidget;
