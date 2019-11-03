## Classes

<dl>
<dt><a href="#FacultyPageAboutMeWidget">FacultyPageAboutMeWidget</a></dt>
<dd><p>The Faculty About Me Widget should show basic information of the specified user.</p></dd>
<dt><a href="#CompletedVerificationsWidget">CompletedVerificationsWidget</a></dt>
<dd><p>Component that naively displays a supplied array of <strong>IVerificationRequests</strong> and the UI for users to handle them.
The parent component is expected to handle permissions and filtering (role and status <strong>are not checked</strong> in this
component).</p></dd>
<dt><a href="#EventVerificationsWidget">EventVerificationsWidget</a></dt>
<dd><p>This component naively displays a supplied array of <strong>IEventOpportunities</strong> and a form to verify individual students.
The parent component is expected to handle permissions and filtering (eventDate property <strong>is not checked</strong> in this
component).</p></dd>
<dt><a href="#ExplorerUsersWidget">ExplorerUsersWidget</a></dt>
<dd><p>This component is a placeholder in case an individual explorer is created for users. It offers
little more than the UserProfileCard, with the most notable differences being a full website
being displayed instead of a button and the IBaseProfile.motivation field being displayed if it exists.</p></dd>
<dt><a href="#PendingVerificationsWidget">PendingVerificationsWidget</a></dt>
<dd><p>Component that naively displays a supplied array of <strong>IVerificationRequests</strong> and the UI for users to handle them.
The parent component is expected to handle permissions and filtering (role and status <strong>are not checked</strong> in this
component).</p></dd>
<dt><a href="#UserProfileCard">UserProfileCard</a></dt>
<dd><p>Component that displays a <Card> given a user profile. Although the interface accepts type <b>any</b>,
this component expects an <b>IBaseProfile</b> and will not render without certain required information.</p></dd>
<dt><a href="#AdminDataModelAcademicPlansPage">AdminDataModelAcademicPlansPage</a></dt>
<dd><p>The AcademicPlan data model page.</p></dd>
<dt><a href="#AdvisorVerificationRequestPage">AdvisorVerificationRequestPage</a></dt>
<dd><p>A simple static component to render some text for the landing page.</p></dd>
<dt><a href="#Signin">Signin</a></dt>
<dd><p>Signin page overrides the form’s submit event and call Meteor’s loginWithPassword().
Authentication errors modify the component’s state to be displayed</p></dd>
</dl>

## Members

<dl>
<dt><a href="#_default">_default</a></dt>
<dd><p>Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter</p></dd>
<dt><a href="#default">default</a></dt>
<dd><p>Addtional Notes:
may have to make quality checks and what not
make alert to notify user that information has been updated sucessfully
conditional showing of interest and career goal labels: if user doesn't have any, text should say:
no career goals/ interests added yet</p></dd>
<dt><a href="#_default">_default</a></dt>
<dd><p>Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter</p></dd>
<dt><a href="#_default">_default</a></dt>
<dd><p>Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter</p></dd>
<dt><a href="#_default">_default</a></dt>
<dd><p>Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter</p></dd>
<dt><a href="#_default">_default</a></dt>
<dd><p>Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter</p></dd>
<dt><a href="#_default">_default</a></dt>
<dd><p>Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter</p></dd>
<dt><a href="#_default">_default</a></dt>
<dd><p>Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter</p></dd>
<dt><a href="#_default">_default</a></dt>
<dd><p>Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter</p></dd>
</dl>

## Objects

<dl>
<dt><a href="#api">api</a> : <code>object</code></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#LandingNavBarContainer">LandingNavBarContainer</a></dt>
<dd><p>withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker</p></dd>
<dt><a href="#NavBarContainer">NavBarContainer</a></dt>
<dd><p>withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker</p></dd>
<dt><a href="#ALLOWED_ROLES">ALLOWED_ROLES</a></dt>
<dd><p>Roles that are allowed access to the Mentor Space</p></dd>
<dt><a href="#LandingHomeContainer">LandingHomeContainer</a></dt>
<dd><p>withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker</p></dd>
<dt><a href="#FirstMenuContainer">FirstMenuContainer</a></dt>
<dd><p>withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker</p></dd>
</dl>

## Functions

<dl>
<dt><a href="#AdminPageMenuWidget">AdminPageMenuWidget()</a></dt>
<dd><p>A simple static component to render some text for the landing page.</p></dd>
<dt><a href="#Footer">Footer()</a></dt>
<dd><p>The LandingFooter appears at the bottom of every page. Rendered by the App Layout component.</p></dd>
<dt><a href="#LandingNavBar">LandingNavBar()</a></dt>
<dd><p>LandingNavBar rendered on each of the landing pages.</p></dd>
<dt><a href="#NavBar">NavBar()</a></dt>
<dd><p>The NavBar appears at the top of every page. Rendered by the App Layout component.</p></dd>
<dt><a href="#CardExplorerWidget">CardExplorerWidget()</a></dt>
<dd><p>Process to build a new Card Explorer Widget
Refer to this documentation if we're building a new Card Explorer Widget for a new type if you simply need to
understand how building the Card Explorer Widget is abstracted.</p>
<ol>
<li>Define a title in @getHeaderTitle() under a new case statement</li>
<li>Build a function to get the item count for that type</li>
<li>Call the function from #2 in @getHeaderCount() under a new case statement</li>
<li>Build a function that calculates if the user needs to add a particular item type to their plan (returns boolean)</li>
<li>Build a render message(s) in @buildNoItemsMessage('noItemsType') that tells the user that they need to add item
type to their plan for each item type that they need</li>
<li>Call the function(s) from #4 in @noItems() under a new case statement for each item type</li>
<li>For each Card Explorer PAGE, call <code>@noItems('noItemsType') ? this.buildNoItemsMessage('noItemsType') : ''</code> for
each of the noItemsType from #5 &amp; #6. If there is more than one item type, this should be wrapped in a &lt;React.Fragment&gt;
##Steps #1 through #7 builds the HEADER for the Card Explorer page.##</li>
<li>Build the main function and any necessary helper functions to get the items to map over for that Card Explorer
page.</li>
<li>Call the main function from #8 under @getItems() under a new case statement for that page.</li>
<li>Add a new typing for the type under ICardExplorerWidgetProps for the Card Explorer Page being built. This string
should be the same as the END string of the url. (i.e. /student/:username/explorer/career-goals. In this case,
career-goals is the type.)</li>
<li>In the render() function, build the Card Explorer Card by mapping over items.</li>
</ol></dd>
<dt><a href="#UserAnswersComponent">UserAnswersComponent(userID)</a> ⇒ <code>Card.Component</code></dt>
<dd></dd>
<dt><a href="#App">App()</a></dt>
<dd><p>Top-level layout component for this application. Called in imports/startup/client/startup.tsx.</p></dd>
<dt><a href="#ProtectedRoute">ProtectedRoute({)</a></dt>
<dd><p>ProtectedRoute (see React Router v4 sample)
Checks for Meteor login before routing to the requested page, otherwise goes to signin page.</p></dd>
<dt><a href="#AdminProtectedRoute">AdminProtectedRoute({)</a></dt>
<dd><p>AdminProtectedRoute (see React Router v4 sample)
Checks for Meteor login and admin role before routing to the requested page, otherwise goes to signin page.</p></dd>
<dt><a href="#AdminAnalyticsPage">AdminAnalyticsPage()</a></dt>
<dd><p>A simple static component to render some text for the landing page.</p></dd>
<dt><a href="#descriptionPairs">descriptionPairs(item)</a></dt>
<dd><p>Returns an array of Description pairs used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitleString">itemTitleString(item)</a></dt>
<dd><p>Returns the title string for the item. Used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitle">itemTitle(item)</a></dt>
<dd><p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p></dd>
<dt><a href="#descriptionPairs">descriptionPairs(item)</a></dt>
<dd><p>Returns an array of Description pairs used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitleString">itemTitleString(item)</a></dt>
<dd><p>Returns the title string for the item. Used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitle">itemTitle(item)</a></dt>
<dd><p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p></dd>
<dt><a href="#descriptionPairs">descriptionPairs(item)</a></dt>
<dd><p>Returns an array of Description pairs used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitleString">itemTitleString(item)</a></dt>
<dd><p>Returns the title string for the item. Used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitle">itemTitle(item)</a></dt>
<dd><p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p></dd>
<dt><a href="#descriptionPairs">descriptionPairs(item)</a></dt>
<dd><p>Returns an array of Description pairs used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitleString">itemTitleString(item)</a></dt>
<dd><p>Returns the title string for the item. Used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitle">itemTitle(item)</a></dt>
<dd><p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p></dd>
<dt><a href="#descriptionPairs">descriptionPairs(item)</a></dt>
<dd><p>Returns an array of Description pairs used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitleString">itemTitleString(item)</a></dt>
<dd><p>Returns the title string for the item. Used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitle">itemTitle(item)</a></dt>
<dd><p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p></dd>
<dt><a href="#descriptionPairs">descriptionPairs(item)</a></dt>
<dd><p>Returns an array of Description pairs used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitleString">itemTitleString(item)</a></dt>
<dd><p>Returns the title string for the item. Used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitle">itemTitle(item)</a></dt>
<dd><p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p></dd>
<dt><a href="#descriptionPairs">descriptionPairs(item)</a></dt>
<dd><p>Returns an array of Description pairs used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitleString">itemTitleString(item)</a></dt>
<dd><p>Returns the title string for the item. Used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitle">itemTitle(item)</a></dt>
<dd><p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p></dd>
<dt><a href="#descriptionPairs">descriptionPairs(item)</a></dt>
<dd><p>Returns an array of Description pairs used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitleString">itemTitleString(item)</a></dt>
<dd><p>Returns the title string for the item. Used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitle">itemTitle(item)</a></dt>
<dd><p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p></dd>
<dt><a href="#descriptionPairs">descriptionPairs(item)</a></dt>
<dd><p>Returns an array of Description pairs used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitleString">itemTitleString(item)</a></dt>
<dd><p>Returns the title string for the item. Used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitle">itemTitle(item)</a></dt>
<dd><p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p></dd>
<dt><a href="#descriptionPairs">descriptionPairs(item)</a></dt>
<dd><p>Returns an array of Description pairs used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitleString">itemTitleString(item)</a></dt>
<dd><p>Returns the title string for the item. Used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitle">itemTitle(item)</a></dt>
<dd><p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p></dd>
<dt><a href="#descriptionPairs">descriptionPairs(item)</a></dt>
<dd><p>Returns an array of Description pairs used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitleString">itemTitleString(item)</a></dt>
<dd><p>Returns the title string for the item. Used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitle">itemTitle(item)</a></dt>
<dd><p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p></dd>
<dt><a href="#descriptionPairs">descriptionPairs(item)</a></dt>
<dd><p>Returns an array of Description pairs used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitleString">itemTitleString(item)</a></dt>
<dd><p>Returns the title string for the item. Used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitle">itemTitle(item)</a></dt>
<dd><p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p></dd>
<dt><a href="#descriptionPairs">descriptionPairs(item)</a></dt>
<dd><p>Returns an array of Description pairs used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitleString">itemTitleString(item)</a></dt>
<dd><p>Returns the title string for the item. Used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitle">itemTitle(item)</a></dt>
<dd><p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p></dd>
<dt><a href="#descriptionPairs">descriptionPairs(item)</a></dt>
<dd><p>Returns an array of Description pairs used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitleString">itemTitleString(item)</a></dt>
<dd><p>Returns the title string for the item. Used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitle">itemTitle(item)</a></dt>
<dd><p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p></dd>
<dt><a href="#descriptionPairs">descriptionPairs(item)</a></dt>
<dd><p>Returns an array of Description pairs used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitleString">itemTitleString(item)</a></dt>
<dd><p>Returns the title string for the item. Used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitle">itemTitle(item)</a></dt>
<dd><p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p></dd>
<dt><a href="#descriptionPairs">descriptionPairs(item)</a></dt>
<dd><p>Returns an array of Description pairs used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitleString">itemTitleString(item)</a></dt>
<dd><p>Returns the title string for the item. Used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitle">itemTitle(item)</a></dt>
<dd><p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p></dd>
<dt><a href="#descriptionPairs">descriptionPairs(item)</a></dt>
<dd><p>Returns an array of Description pairs used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitleString">itemTitleString(item)</a></dt>
<dd><p>Returns the title string for the item. Used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitle">itemTitle(item)</a></dt>
<dd><p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p></dd>
<dt><a href="#descriptionPairs">descriptionPairs(item)</a></dt>
<dd><p>Returns an array of Description pairs used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitleString">itemTitleString(item)</a></dt>
<dd><p>Returns the title string for the item. Used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitle">itemTitle(item)</a></dt>
<dd><p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p></dd>
<dt><a href="#descriptionPairs">descriptionPairs(item)</a></dt>
<dd><p>Returns an array of Description pairs used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitleString">itemTitleString(item)</a></dt>
<dd><p>Returns the title string for the item. Used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitle">itemTitle(item)</a></dt>
<dd><p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p></dd>
<dt><a href="#AdminModerationPage">AdminModerationPage()</a></dt>
<dd><p>A simple static component to render some text for the landing page.</p></dd>
<dt><a href="#descriptionPairs">descriptionPairs(item)</a></dt>
<dd><p>Returns an array of Description pairs used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitleString">itemTitleString(item)</a></dt>
<dd><p>Returns the title string for the item. Used in the ListCollectionWidget.</p></dd>
<dt><a href="#itemTitle">itemTitle(item)</a></dt>
<dd><p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p></dd>
<dt><a href="#LandingHome">LandingHome()</a></dt>
<dd><p>A simple static component to render some text for the landing page.</p></dd>
<dt><a href="#MentorHomePage">MentorHomePage()</a></dt>
<dd><p>A simple static component to render some text for the landing page.</p></dd>
<dt><a href="#MentorMentorSpacePage">MentorMentorSpacePage()</a></dt>
<dd><p>A simple static component to render some text for the landing page.</p></dd>
<dt><a href="#NotFound">NotFound()</a></dt>
<dd><p>Render a Not Found page if the user enters a URL that doesn't match any route.</p></dd>
<dt><a href="#Signout">Signout()</a></dt>
<dd><p>After the user clicks the &quot;Signout&quot; link in the NavBar, log them out and display this page.</p></dd>
</dl>

<a name="FacultyPageAboutMeWidget"></a>

## FacultyPageAboutMeWidget
<p>The Faculty About Me Widget should show basic information of the specified user.</p>

**Kind**: global class  
<a name="FacultyPageAboutMeWidget+render"></a>

### facultyPageAboutMeWidget.render()
<p>Renders all components</p>

**Kind**: instance method of [<code>FacultyPageAboutMeWidget</code>](#FacultyPageAboutMeWidget)  
<a name="CompletedVerificationsWidget"></a>

## CompletedVerificationsWidget
<p>Component that naively displays a supplied array of <strong>IVerificationRequests</strong> and the UI for users to handle them.
The parent component is expected to handle permissions and filtering (role and status <strong>are not checked</strong> in this
component).</p>

**Kind**: global class  
<a name="new_CompletedVerificationsWidget_new"></a>

### new CompletedVerificationsWidget(completedVerifications, username)

| Param | Type | Description |
| --- | --- | --- |
| completedVerifications | <code>Array.&lt;IVerificationRequest&gt;</code> |  |
| username | <code>string</code> | <p>Current user's username. Used primarily for getting name of user when making changes to records.</p> |

<a name="EventVerificationsWidget"></a>

## EventVerificationsWidget
<p>This component naively displays a supplied array of <strong>IEventOpportunities</strong> and a form to verify individual students.
The parent component is expected to handle permissions and filtering (eventDate property <strong>is not checked</strong> in this
component).</p>

**Kind**: global class  
<a name="new_EventVerificationsWidget_new"></a>

### new EventVerificationsWidget(eventOpportunities)

| Param | Type | Description |
| --- | --- | --- |
| eventOpportunities | <code>Array.&lt;IEventOpportunity&gt;</code> | <p>An array of IOpportunities where eventDate exists</p> |

<a name="ExplorerUsersWidget"></a>

## ExplorerUsersWidget
<p>This component is a placeholder in case an individual explorer is created for users. It offers
little more than the UserProfileCard, with the most notable differences being a full website
being displayed instead of a button and the IBaseProfile.motivation field being displayed if it exists.</p>

**Kind**: global class  
<a name="new_ExplorerUsersWidget_new"></a>

### new ExplorerUsersWidget(userProfile, isActive, handleClose)

| Param | Type | Description |
| --- | --- | --- |
| userProfile | <code>IBaseProfile</code> | <p>User profile to be displayed</p> |
| isActive | <code>boolean</code> | <p>This component expects the parent to manage state</p> |
| handleClose |  | <p>Handler to close component (dimmer) when clicking outside of the component</p> |

<a name="PendingVerificationsWidget"></a>

## PendingVerificationsWidget
<p>Component that naively displays a supplied array of <strong>IVerificationRequests</strong> and the UI for users to handle them.
The parent component is expected to handle permissions and filtering (role and status <strong>are not checked</strong> in this
component).</p>

**Kind**: global class  
<a name="new_PendingVerificationsWidget_new"></a>

### new PendingVerificationsWidget(pendingVerifications)

| Param | Type |
| --- | --- |
| pendingVerifications | <code>Array.&lt;IVerificationRequest&gt;</code> | 

<a name="UserProfileCard"></a>

## UserProfileCard
<p>Component that displays a <Card> given a user profile. Although the interface accepts type <b>any</b>,
this component expects an <b>IBaseProfile</b> and will not render without certain required information.</p>

**Kind**: global class  
<a name="new_UserProfileCard_new"></a>

### new UserProfileCard(item)

| Param | Type | Description |
| --- | --- | --- |
| item | <code>IBaseProfile</code> | <p>A user profile to process for display on the card</p> |

<a name="AdminDataModelAcademicPlansPage"></a>

## AdminDataModelAcademicPlansPage
<p>The AcademicPlan data model page.</p>

**Kind**: global class  
<a name="AdvisorVerificationRequestPage"></a>

## AdvisorVerificationRequestPage
<p>A simple static component to render some text for the landing page.</p>

**Kind**: global class  
<a name="Signin"></a>

## Signin
<p>Signin page overrides the form’s submit event and call Meteor’s loginWithPassword().
Authentication errors modify the component’s state to be displayed</p>

**Kind**: global class  

* [Signin](#Signin)
    * [new Signin()](#new_Signin_new)
    * [.render()](#Signin+render)

<a name="new_Signin_new"></a>

### new Signin()
<p>Initialize component state with properties for login and redirection.</p>

<a name="Signin+render"></a>

### signin.render()
<p>Render the signin form.</p>

**Kind**: instance method of [<code>Signin</code>](#Signin)  
<a name="_default"></a>

## \_default
<p>Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter</p>

**Kind**: global variable  
<a name="default"></a>

## default
<p>Addtional Notes:
may have to make quality checks and what not
make alert to notify user that information has been updated sucessfully
conditional showing of interest and career goal labels: if user doesn't have any, text should say:
no career goals/ interests added yet</p>

**Kind**: global variable  
<a name="_default"></a>

## \_default
<p>Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter</p>

**Kind**: global variable  
<a name="_default"></a>

## \_default
<p>Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter</p>

**Kind**: global variable  
<a name="_default"></a>

## \_default
<p>Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter</p>

**Kind**: global variable  
<a name="_default"></a>

## \_default
<p>Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter</p>

**Kind**: global variable  
<a name="_default"></a>

## \_default
<p>Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter</p>

**Kind**: global variable  
<a name="_default"></a>

## \_default
<p>Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter</p>

**Kind**: global variable  
<a name="_default"></a>

## \_default
<p>Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter</p>

**Kind**: global variable  
<a name="api"></a>

## api : <code>object</code>
**Kind**: global namespace  
<a name="LandingNavBarContainer"></a>

## LandingNavBarContainer
<p>withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker</p>

**Kind**: global constant  
<a name="NavBarContainer"></a>

## NavBarContainer
<p>withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker</p>

**Kind**: global constant  
<a name="ALLOWED_ROLES"></a>

## ALLOWED\_ROLES
<p>Roles that are allowed access to the Mentor Space</p>

**Kind**: global constant  
<a name="LandingHomeContainer"></a>

## LandingHomeContainer
<p>withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker</p>

**Kind**: global constant  
<a name="FirstMenuContainer"></a>

## FirstMenuContainer
<p>withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker</p>

**Kind**: global constant  
<a name="AdminPageMenuWidget"></a>

## AdminPageMenuWidget()
<p>A simple static component to render some text for the landing page.</p>

**Kind**: global function  
<a name="Footer"></a>

## Footer()
<p>The LandingFooter appears at the bottom of every page. Rendered by the App Layout component.</p>

**Kind**: global function  
<a name="LandingNavBar"></a>

## LandingNavBar()
<p>LandingNavBar rendered on each of the landing pages.</p>

**Kind**: global function  
<a name="NavBar"></a>

## NavBar()
<p>The NavBar appears at the top of every page. Rendered by the App Layout component.</p>

**Kind**: global function  
<a name="CardExplorerWidget"></a>

## CardExplorerWidget()
<p>Process to build a new Card Explorer Widget
Refer to this documentation if we're building a new Card Explorer Widget for a new type if you simply need to
understand how building the Card Explorer Widget is abstracted.</p>
<ol>
<li>Define a title in @getHeaderTitle() under a new case statement</li>
<li>Build a function to get the item count for that type</li>
<li>Call the function from #2 in @getHeaderCount() under a new case statement</li>
<li>Build a function that calculates if the user needs to add a particular item type to their plan (returns boolean)</li>
<li>Build a render message(s) in @buildNoItemsMessage('noItemsType') that tells the user that they need to add item
type to their plan for each item type that they need</li>
<li>Call the function(s) from #4 in @noItems() under a new case statement for each item type</li>
<li>For each Card Explorer PAGE, call <code>@noItems('noItemsType') ? this.buildNoItemsMessage('noItemsType') : ''</code> for
each of the noItemsType from #5 &amp; #6. If there is more than one item type, this should be wrapped in a &lt;React.Fragment&gt;
##Steps #1 through #7 builds the HEADER for the Card Explorer page.##</li>
<li>Build the main function and any necessary helper functions to get the items to map over for that Card Explorer
page.</li>
<li>Call the main function from #8 under @getItems() under a new case statement for that page.</li>
<li>Add a new typing for the type under ICardExplorerWidgetProps for the Card Explorer Page being built. This string
should be the same as the END string of the url. (i.e. /student/:username/explorer/career-goals. In this case,
career-goals is the type.)</li>
<li>In the render() function, build the Card Explorer Card by mapping over items.</li>
</ol>

**Kind**: global function  
<a name="UserAnswersComponent"></a>

## UserAnswersComponent(userID) ⇒ <code>Card.Component</code>
**Kind**: global function  
**Returns**: <code>Card.Component</code> - <p>A component meant to be used on a <Card>.</p>  

| Param | Type | Description |
| --- | --- | --- |
| userID | <code>string</code> | <p>UserID used to search for answers in the database</p> |

<a name="App"></a>

## App()
<p>Top-level layout component for this application. Called in imports/startup/client/startup.tsx.</p>

**Kind**: global function  
<a name="ProtectedRoute"></a>

## ProtectedRoute({)
<p>ProtectedRoute (see React Router v4 sample)
Checks for Meteor login before routing to the requested page, otherwise goes to signin page.</p>

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| { | <code>any</code> | <p>component: Component, ...rest }</p> |

<a name="AdminProtectedRoute"></a>

## AdminProtectedRoute({)
<p>AdminProtectedRoute (see React Router v4 sample)
Checks for Meteor login and admin role before routing to the requested page, otherwise goes to signin page.</p>

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| { | <code>any</code> | <p>component: Component, ...rest }</p> |

<a name="AdminAnalyticsPage"></a>

## AdminAnalyticsPage()
<p>A simple static component to render some text for the landing page.</p>

**Kind**: global function  
<a name="descriptionPairs"></a>

## descriptionPairs(item)
<p>Returns an array of Description pairs used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitleString"></a>

## itemTitleString(item)
<p>Returns the title string for the item. Used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitle"></a>

## itemTitle(item)
<p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="descriptionPairs"></a>

## descriptionPairs(item)
<p>Returns an array of Description pairs used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitleString"></a>

## itemTitleString(item)
<p>Returns the title string for the item. Used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitle"></a>

## itemTitle(item)
<p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="descriptionPairs"></a>

## descriptionPairs(item)
<p>Returns an array of Description pairs used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitleString"></a>

## itemTitleString(item)
<p>Returns the title string for the item. Used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitle"></a>

## itemTitle(item)
<p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="descriptionPairs"></a>

## descriptionPairs(item)
<p>Returns an array of Description pairs used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitleString"></a>

## itemTitleString(item)
<p>Returns the title string for the item. Used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitle"></a>

## itemTitle(item)
<p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="descriptionPairs"></a>

## descriptionPairs(item)
<p>Returns an array of Description pairs used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitleString"></a>

## itemTitleString(item)
<p>Returns the title string for the item. Used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitle"></a>

## itemTitle(item)
<p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="descriptionPairs"></a>

## descriptionPairs(item)
<p>Returns an array of Description pairs used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitleString"></a>

## itemTitleString(item)
<p>Returns the title string for the item. Used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitle"></a>

## itemTitle(item)
<p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="descriptionPairs"></a>

## descriptionPairs(item)
<p>Returns an array of Description pairs used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitleString"></a>

## itemTitleString(item)
<p>Returns the title string for the item. Used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitle"></a>

## itemTitle(item)
<p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="descriptionPairs"></a>

## descriptionPairs(item)
<p>Returns an array of Description pairs used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitleString"></a>

## itemTitleString(item)
<p>Returns the title string for the item. Used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitle"></a>

## itemTitle(item)
<p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="descriptionPairs"></a>

## descriptionPairs(item)
<p>Returns an array of Description pairs used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitleString"></a>

## itemTitleString(item)
<p>Returns the title string for the item. Used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitle"></a>

## itemTitle(item)
<p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="descriptionPairs"></a>

## descriptionPairs(item)
<p>Returns an array of Description pairs used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitleString"></a>

## itemTitleString(item)
<p>Returns the title string for the item. Used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitle"></a>

## itemTitle(item)
<p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="descriptionPairs"></a>

## descriptionPairs(item)
<p>Returns an array of Description pairs used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitleString"></a>

## itemTitleString(item)
<p>Returns the title string for the item. Used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitle"></a>

## itemTitle(item)
<p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="descriptionPairs"></a>

## descriptionPairs(item)
<p>Returns an array of Description pairs used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitleString"></a>

## itemTitleString(item)
<p>Returns the title string for the item. Used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitle"></a>

## itemTitle(item)
<p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="descriptionPairs"></a>

## descriptionPairs(item)
<p>Returns an array of Description pairs used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitleString"></a>

## itemTitleString(item)
<p>Returns the title string for the item. Used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitle"></a>

## itemTitle(item)
<p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="descriptionPairs"></a>

## descriptionPairs(item)
<p>Returns an array of Description pairs used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitleString"></a>

## itemTitleString(item)
<p>Returns the title string for the item. Used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitle"></a>

## itemTitle(item)
<p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="descriptionPairs"></a>

## descriptionPairs(item)
<p>Returns an array of Description pairs used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitleString"></a>

## itemTitleString(item)
<p>Returns the title string for the item. Used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitle"></a>

## itemTitle(item)
<p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="descriptionPairs"></a>

## descriptionPairs(item)
<p>Returns an array of Description pairs used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitleString"></a>

## itemTitleString(item)
<p>Returns the title string for the item. Used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitle"></a>

## itemTitle(item)
<p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="descriptionPairs"></a>

## descriptionPairs(item)
<p>Returns an array of Description pairs used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitleString"></a>

## itemTitleString(item)
<p>Returns the title string for the item. Used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitle"></a>

## itemTitle(item)
<p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="descriptionPairs"></a>

## descriptionPairs(item)
<p>Returns an array of Description pairs used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitleString"></a>

## itemTitleString(item)
<p>Returns the title string for the item. Used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitle"></a>

## itemTitle(item)
<p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="descriptionPairs"></a>

## descriptionPairs(item)
<p>Returns an array of Description pairs used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitleString"></a>

## itemTitleString(item)
<p>Returns the title string for the item. Used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitle"></a>

## itemTitle(item)
<p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="AdminModerationPage"></a>

## AdminModerationPage()
<p>A simple static component to render some text for the landing page.</p>

**Kind**: global function  
<a name="descriptionPairs"></a>

## descriptionPairs(item)
<p>Returns an array of Description pairs used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitleString"></a>

## itemTitleString(item)
<p>Returns the title string for the item. Used in the ListCollectionWidget.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="itemTitle"></a>

## itemTitle(item)
<p>Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.</p>

**Kind**: global function  

| Param | Description |
| --- | --- |
| item | <p>an item from the collection.</p> |

<a name="LandingHome"></a>

## LandingHome()
<p>A simple static component to render some text for the landing page.</p>

**Kind**: global function  
<a name="MentorHomePage"></a>

## MentorHomePage()
<p>A simple static component to render some text for the landing page.</p>

**Kind**: global function  
<a name="MentorMentorSpacePage"></a>

## MentorMentorSpacePage()
<p>A simple static component to render some text for the landing page.</p>

**Kind**: global function  
<a name="NotFound"></a>

## NotFound()
<p>Render a Not Found page if the user enters a URL that doesn't match any route.</p>

**Kind**: global function  
<a name="Signout"></a>

## Signout()
<p>After the user clicks the &quot;Signout&quot; link in the NavBar, log them out and display this page.</p>

**Kind**: global function  
