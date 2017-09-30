port module App.Update exposing (update)

import App.Model exposing (App)
import App.Routing
import App.Decoder
import App.Encoder
import App.Msg exposing (Msg(..))
import App.UrlUpdate
import Race.Model exposing (Race)
import Rider.Model
import Comment.Model
import Result.Model
import Result.Update
import Comment.Update
import Account.Update
import Race.Update
import String
import Debug
import Array
import Set
import Json.Decode
import App.Decoder
import Date
import Time
import Date.Extra
import Task
import Keyboard.Extra
import Dom
import Json.Encode
import Json.Decode
import App.Helpers
import Rider.Update
import Ui.Ratings
import Ui.Calendar
import Ui.Chooser
import Navigation

port setLocalStorage : (String, String) -> Cmd msg
port getLocalStorage : String -> Cmd msg

update : Msg -> App -> ( App, Cmd Msg )
update msg app =
    let
        noOp =
            ( app, Cmd.none )
    in
        case msg of
            RaceAdd ->
                case app.page of
                    App.Model.RaceAdd raceAdd ->
                        noOp
                    _ ->
                        noOp

            RaceName name ->
                let
                    page =
                        Race.Update.addPage2 msg app.page
                in
                    { app | page = page } ! []

            RaceAddCategory category ->
                let
                    page =
                        Race.Update.addPage2 msg app.page
                in
                    { app | page = page } ! []

            RaceDate newDate ->
                let
                    page =
                        Race.Update.addPage2 msg app.page
                in
                    { app | page = page } ! []

            ResultAdd ->
                case app.page of
                    App.Model.ResultAdd resultAdd ->
                        case app.riders of
                            Just riders ->
                                -- case Result.Update.add resultAdd riders app.results
                                noOp

                            Nothing ->
                                noOp

                    _ ->
                        noOp

            ResultAddCategory category ->
                ( (case app.page of
                    App.Model.ResultAdd resultAdd ->
                        { app
                            | page =
                                App.Model.ResultAdd <| Result.Update.addCategory category resultAdd
                        }

                    _ ->
                        app
                  )
                , Cmd.none
                )

            ResultAddStrava link ->
                ( case app.page of
                    App.Model.ResultAdd resultAdd ->
                        { app
                            | page =
                                App.Model.ResultAdd <| Result.Update.addStrava link resultAdd
                        }

                    _ ->
                        app
                , Cmd.none
                )

            ResultAddResult value ->
                ( case app.page of
                    App.Model.ResultAdd resultAdd ->
                        { app
                            | page =
                                App.Model.ResultAdd <| Result.Update.addResult value resultAdd
                        }

                    _ ->
                        app
                , Cmd.none
                )

            CommentAddSetText text ->
                ( case app.page of
                    App.Model.CommentAdd commentAdd ->
                        { app
                            | page =
                                App.Model.CommentAdd <| Comment.Update.addText text commentAdd
                        }

                    _ ->
                        app
                , Cmd.none
                )

            CommentAddSetRiderName riderName ->
                ( case app.page of
                    App.Model.CommentAdd commentAdd ->
                        { app
                            | page =
                                App.Model.CommentAdd <| Comment.Update.addRiderName riderName commentAdd
                        }

                    _ ->
                        app
                , Cmd.none
                )

            CommentAdd ->
                case app.page of
                    App.Model.CommentAdd commentAdd ->
                        case app.riders of
                            Just riders ->
                                noOp

                            Nothing ->
                                noOp

                    _ ->
                        noOp

            UrlUpdate route ->
                App.UrlUpdate.urlUpdate route app

            NavigateTo route ->
                ( app, App.Helpers.navigate route )

            AccountLoginSubmit ->
                Account.Update.loginSubmit app

            AccountLogin email ->
                Account.Update.login email app

            AccountLoginEmail name ->
                Account.Update.loginEmail name app

            AccountLoginPassword password ->
                Account.Update.loginPassword password app

            AccountLogoutSubmit ->
                Account.Update.logoutSubmit app
                
            AccountLogout email ->
                Account.Update.logout email app

            AccountSignup ->
                Account.Update.signup app

            AccountLicence licence ->
                Account.Update.settingsLicence licence app
            
            OnCreatedRider rawResponse ->
                let
                    riderResult =
                        Json.Decode.decodeValue App.Decoder.riderDecoder rawResponse
                in
                    case riderResult of
                        Ok rider ->
                            let
                                newRider =
                                    Rider.Model.Rider
                                        rider.id
                                        rider.name
                                        rider.licence
                            in
                                ( { app | riders = Just (newRider :: (Maybe.withDefault [] app.riders)) }
                                , Cmd.none
                                )

                        Err _ ->
                            noOp

            OnCreatedRace rawResponse ->
                let
                    raceResult =
                        Json.Decode.decodeValue App.Decoder.raceDecoder rawResponse
                in
                    case raceResult of
                        Ok race ->
                            let
                                newRace =
                                    Race.Model.Race
                                        race.id
                                        race.name
                                        race.date
                                        race.category
                            in
                                ( { app | races = Just (newRace :: (Maybe.withDefault [] app.races)) }
                                , Cmd.none
                                )

                        Err _ ->
                            noOp

            OnCreatedResult rawResponse ->
                let
                    resultResult =
                        Json.Decode.decodeValue App.Decoder.resultDecoder rawResponse
                in
                    case resultResult of
                        Ok result ->
                            let
                                newResult =
                                    Result.Model.Result
                                        result.id
                                        result.riderId
                                        result.raceId
                                        result.result
                                        Result.Model.CatA
                                        result.strava
                            in
                                ( { app | results = newResult :: app.results }
                                , Cmd.none
                                )

                        Err _ ->
                            noOp

            OnCreatedComment rawResponse ->
                let
                    commentResult =
                        Json.Decode.decodeValue App.Decoder.commentDecoder rawResponse
                in
                    case commentResult of
                        Ok comment ->
                            let
                                newComment =
                                    Comment.Model.Comment
                                        comment.id
                                        comment.updatedAt
                                        comment.raceId
                                        comment.riderId
                                        comment.text
                            in
                                ( { app | comments = Just (newComment :: (Maybe.withDefault [] app.comments)) }
                                , Cmd.none
                                )

                        Err _ ->
                            noOp

            OnUpdatedRider rawResponse ->
                let
                    riderResult =
                        Debug.log "riderResult in onUpdatedRider" (Json.Decode.decodeValue App.Decoder.riderDecoder rawResponse)
                in
                    case riderResult of
                        Ok rider ->
                            let
                                riders =
                                    Debug.log
                                        "updatedRiders: "
                                        (App.Helpers.updateRiderLicence rider.id rider.licence (Maybe.withDefault [] app.riders))

                                nextAccount =
                                    case app.account of
                                        Just account ->
                                            case account.id == rider.id of
                                                True ->
                                                    Just { account | licence = rider.licence }

                                                False ->
                                                    Just account

                                        Nothing ->
                                            Nothing
                            in
                                ( { app
                                    | riders = Just riders
                                    , account = nextAccount
                                  }
                                , Cmd.none
                                )

                        Err _ ->
                            noOp

            -- TODO: link account to one rider?
            Noop ->
                noOp

            ReceiveRiders message ->
                let
                    resultRiders =
                        (Json.Decode.decodeValue
                            (Json.Decode.field "riders" (Json.Decode.list App.Decoder.riderDecoder))
                            message
                        )

                    messages =
                        (toString message) :: app.messages
                in
                    case resultRiders of
                        Ok riders ->
                            ( { app | messages = messages, riders = Just riders }
                            , Cmd.none
                            )

                        Err errorMessage ->
                            ( { app | messages = messages }
                            , Cmd.none
                            )

            ReceiveMessage message ->
                let
                    _ =
                        Debug.log "receiveMessage" message
                in
                    --( { app | messages = (toString message) :: app.messages }
                    --( { app | connected = True }
                    ( app
                    , Cmd.none
                    )

            HandleSendError _ ->
                noOp

            NewMessage message ->
                ( { app | messages = message :: app.messages }
                , Cmd.none
                )

            DatePicked dateString ->
                case app.page of
                    App.Model.RaceAdd raceAdd ->
                        let
                            page =
                                Race.Update.addPage2 (App.Msg.RaceDate dateString) app.page

                            -- nextRaceAdd = { raceAdd | dateString = dateString }
                        in
                            ( { app | page = page }, Cmd.none )

                    _ ->
                        ( app, Cmd.none )

            Ratings msg_ ->
                let
                    ( ratings, cmd ) =
                        Ui.Ratings.update msg_ app.ratings
                in
                    ( { app | ratings = ratings }
                    , Cmd.map Ratings cmd
                    )

            Calendar msg_ ->
                case app.page of
                    App.Model.RaceAdd raceAdd ->
                        let
                            ( calendar, cmd ) =
                                Ui.Calendar.update msg_ raceAdd.calendar

                            nextRaceAdd = App.Model.RaceAdd { raceAdd | calendar = calendar }
                        in
                            ( { app | page = nextRaceAdd }
                            , Cmd.map Calendar cmd
                            )
                    _ ->
                        noOp


            Chooser msg_ ->
                case app.page of
                    App.Model.ResultAdd resultAdd ->
                        let
                            ( chooser, cmd ) =
                                Ui.Chooser.update msg_ resultAdd.chooser


                            nextResultAdd = App.Model.ResultAdd { resultAdd | chooser = chooser }
                        in
                            ( { app | page = nextResultAdd }
                            , Cmd.map Chooser cmd
                            )
                    _ ->
                        noOp

            StravaAuthorize ->
                ( app, Navigation.load "https://www.strava.com/oauth/authorize?client_id=1596&response_type=code&redirect_uri=http://localhost:8080/%23account/login/strava/code" ) --&approval_prompt=force" )

            StravaReceiveAccessToken rawResponse ->
                let
                    bodyResult =
                        Json.Decode.decodeValue (Json.Decode.field "body" Json.Decode.string) rawResponse
                    bla = case bodyResult of
                        Ok body ->
                            Json.Decode.decodeString (Json.Decode.field "access_token" Json.Decode.string) body
                        Err err ->
                            let
                                _ = Debug.log "err" err
                            in
                                Ok ""
                in
                    case bla of
                        Ok accessToken ->
                            ( app, setLocalStorage ("accessToken", accessToken) )

                        Err err ->
                            let
                                _ = Debug.log "err" err
                            in
                                ( app, Cmd.none )

