module Rider.Update exposing (setRiderAddName, add)

import App.Model exposing (App)
import Rider.Model exposing (Rider, RiderAdd)
import App.Msg exposing (Msg(..))
import Navigation


add : App -> Rider -> ( App, Cmd Msg )
add app rider =
    case app.riders of
        Just riders ->
            let
                newRider =
                    setRiderId rider riders

                newApp =
                    setRiderAdd app (clearRiderName app.riderAdd.rider)
            in
                ( { newApp
                    | riders = Just (List.append [ newRider ] riders)
                  }
                , Navigation.newUrl ("#riders/" ++ (toString newRider.id))
                )

        Nothing ->
            ( app, Cmd.none )


setRiderAddName : App -> String -> ( App, Cmd Msg )
setRiderAddName app newName =
    ( setRiderAdd app (setRiderName app.riderAdd.rider newName)
    , Cmd.none
    )


setRiderAdd : App -> Rider -> App
setRiderAdd app newRider =
    { app
        | riderAdd = (setRider app.riderAdd newRider)
    }


setRiderName : Rider -> String -> Rider
setRiderName rider name =
    { rider | name = name }


clearRiderName : Rider -> Rider
clearRiderName rider =
    setRiderName rider ""


setRider : RiderAdd -> Rider -> RiderAdd
setRider riderAdd rider =
    { riderAdd | rider = rider }


calcRiderId : List Rider -> Int
calcRiderId riders =
    (List.length riders) + 1


setRiderId : Rider -> List Rider -> Rider
setRiderId rider riders =
    let
        id =
            calcRiderId riders
    in
        { rider | id = id }
